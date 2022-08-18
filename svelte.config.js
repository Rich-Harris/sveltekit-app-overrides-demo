import path from 'path';
import { execSync as run } from 'child_process';
import glob from 'tiny-glob/sync.js';
import adapter from '@sveltejs/adapter-auto';

const project = process.env.PROJECT;

let routes = 'src/routes';

if (project) {
	const project_files = new Set(
		glob('**', { cwd: `src/${project}`, filesOnly: true })
	);
	const default_files = new Set(glob('**', { cwd: routes, filesOnly: true }));

	run(`rm -rf src/.routes-${project}`);
	run(`cp -r src/${project} src/.routes-${project}`);

	for (const file of default_files) {
		if (!project_files.has(file)) {
			run(`mkdir -p ${path.dirname(`src/.routes-${project}/${file}`)}`);
			run(`cp ${routes}/${file} src/.routes-${project}/${file}`);
		}
	}

	routes = `src/.routes-${project}`;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		files: {
			routes
		}
	}
};

export default config;
