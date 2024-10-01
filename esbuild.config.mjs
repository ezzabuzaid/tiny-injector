import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { join } from 'path';

esbuild.build({
	entryPoints: [join(
		process.cwd(),
		'src',
		'index.ts'
	)],
    outfile: join(
		process.cwd(),
		'dist',
		'index.js'
	),
    format: 'esm',
    platform: 'neutral',
    treeShaking: true,
    minify: false,
    keepNames: true,
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
    bundle: true,
    tsconfig: join(
		process.cwd(),
		'tsconfig.app.json'
	),
    plugins: [
      nodeExternalsPlugin({
        packagePath: [join(process.cwd(), 'package.json')],
      }),
    ],
  })