/* jshint node: true */

/*
@module gulp.deploy

This gulp task will build the project for production and push it into a netsuite's account. The user must only setup
a suitelet (located in folder ns-deploy) and create the SSP application record. Both things must be done only once
and then deployment can be done multiple times. This setup is described in the document 'Dev Tools Getting Started'.

##Usage

	gulp deploy

If the deploy script/deploy id are not the defaults (customscript_sca_deployer / customdeploy_sca_deployer)
you can always pass these ids as arguments: 

	gulp deploy --deploy-id=customdeploy_sca_deployer_2 --script-id=customscript_sca_deployer_2

The deploy will also upload all the sources in a zip file so anybody can download the distribution. Nevertheless this 
is not mandatory to the deployed site to work, so it can be disabled by using the --no-backup argument. 

If you have your sources already compiled you can pass --skip-compilation argument. Use this only if you know what you are doing!

*/

'use strict';

var args   = require('yargs').argv
,	gulp = require('gulp')
,	path = require('path')
,	async = require('async')
,	ns = require('../ns-deploy')
,	mapFunctions = require('../library/map-functions')
,	package_manager = require('../package-manager')
,	del = require('del').sync
,	_ = require('underscore')
,	inquirer = require('inquirer');

// Only if we are invoking deploy from the command line.
if (args._.indexOf('deploy') >= 0)
{
	process.gulp_dest = process.gulp_dest_deploy;
	// Delete previous files, so we deploy only what we need.
	del([
		process.gulp_dest + '/**'
	], {force:true});
}

function deploy(cb)
{
	del([
		process.gulp_dest + '/processed-macros'
	,	process.gulp_dest + '/processed-templates'
	,	process.gulp_dest + '/sass'
	], {force:true});

	var options = {};

	if (args.interactive)
	{
		options = {
			interactive: true
		};
	}
	else if (args.tag || args.description)
	{
		options = {
			tag: args.tag
		,	description: args.description
		};
	}
	if(args.to)
	{
		options.newDeploy = true;
	}
	if(args.m)
	{
		options.molecule = args.m;
	}

	var files = [path.join(process.gulp_init_cwd, '.nsdeploy')];

	if(args.f)
	{
		files = args.f.split(',');
	}

	if(args.password)
	{
		inquirer.prompt(
		{
				type: 'password'
			,	name: 'password'
			,	message: 'Password'
			,	validate: function(input)
				{
					return input.length > 0 || 'Please enter a password';
				}
			}
		,	function(answers)
			{
				options.password = answers.password;
				runDeploy(files, options, cb);
			}
		);
	}
	else
	{
		runDeploy(files, options, cb);
	}
}

function runDeploy(files, options, cb)
{
	var tasks = _.map(files, function(file){
	return function(cb)
		{
			var configs = package_manager.getTaskConfig('deploy', []);
			options.distroName = package_manager.distro.name;
			options.file = file;
			options.scriptId = configs.scriptId;
			options.deployId = configs.deployId;
			options.publicList = configs.publicList;
			options.backup = configs.backup;

			var license_text = package_manager.distro.license.text;
			gulp.src(process.gulp_dest + '/**')
				.pipe(mapFunctions.mapAddLicense(license_text))
				.pipe(ns.deploy(options))
				.on('end', function()
				{
					cb();
				});
		};
	});

	async.series(tasks, function(err)
	{
		cb(err);
		process.exit();
	});
}

function deployVersion ()
{
	return gulp.src('./version.txt')
			.pipe(gulp.dest(process.gulp_dest));
}

var source = ['default'];
if (args.source)
{
	source = args.source.split(',');
}
else if (args.dev)
{
	source = ['services','ssp-libraries','ssp-files', 'scripts'];
}
else if (args.skipCompilation)
{
	source = [];
}
source.push('deploy-version');

gulp.task('deploy-version', deployVersion);

gulp.task('deploy',	source, deploy);
gulp.task('deploy-no-deps', deploy);

gulp.task('rollback', function(cb)
{
	ns.rollback(cb);
});