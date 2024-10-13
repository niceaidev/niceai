import fs from 'fs-extra';
import path from 'node:path';
// @ts-ignore
import ncc from '@vercel/ncc';

export type VercelRuntime = 'node' | 'edge';

export interface BuildOptions {
  output: string;
  vercel: boolean;
  entry: string;
  root: string;
  staticDir: string;
}

class Builder {
  constructor(private opts: BuildOptions) {
    this.opts = opts;
  }

  async build() {
    const configJson = {
      version: 3,
      routes: [
        {
          src: '.*',
          dest: '_serverless',
        },
      ] as any[],
      overrides: {},
      crons: [],
    };

    const vcConfig = {
      edge: {
        runtime: 'edge',
        entrypoint: 'index.js',
      },
      node: {
        runtime: 'nodejs20.x',
        handler: 'index.js',
        launcherType: 'Nodejs',
      },
    } satisfies Record<VercelRuntime, object>;

    const bundleName = 'index.js';
    const {
      output = 'dist',
      vercel = false,
      entry = 'src/main.ts',
      root,
    } = this.opts;
    const outputPath = vercel ? path.join(root, '.vercel/output') : output;
    const dirs = {
      functions: path.join(outputPath, 'functions'),
      static: path.join(outputPath, 'static'),
    };

    fs.removeSync(outputPath);
    fs.ensureDirSync(outputPath);
    const targetPath = vercel
      ? path.join(dirs.functions, '_serverless.func')
      : output;
    fs.ensureDirSync(targetPath);
    fs.ensureDirSync(path.join(outputPath, 'static'));
    fs.copySync(this.opts.staticDir, path.join(outputPath, 'static'), {
      overwrite: true,
    });
    // @ts-ignore
    const { code, assets } = await ncc(path.join(root, entry), {
      minify: false,
      sourceMap: true,
      out: targetPath,
      cache: true,
      externals: [],
      assetsBuilds: false,
    });

    // copy assets
    for (const assetKey of Object.keys(assets)) {
      const asset = assets[assetKey];
      const data = asset.source;
      const fileTarget = path.join(targetPath, assetKey);
      fs.ensureDirSync(path.dirname(fileTarget));
      fs.writeFileSync(fileTarget, data);
    }

    // write code to package
    const outfile = path.join(targetPath, bundleName);
    fs.ensureDirSync(path.dirname(outfile));
    fs.writeFileSync(path.join(targetPath, bundleName), code, 'utf-8');

    if (this.opts.vercel) {
      fs.mkdirSync(outputPath, { recursive: true });
      fs.mkdirSync(path.join(outputPath, 'functions/_serverless.func'), {
        recursive: true,
      });
      fs.writeJsonSync(
        path.join(outputPath, 'functions/_serverless.func/.vc-config.json'),
        vcConfig.node,
        {
          spaces: 2,
          encoding: 'utf-8',
        },
      );
      configJson.routes.unshift({
        handle: 'filesystem',
      });
      fs.writeJsonSync(path.join(outputPath, 'config.json'), configJson, {
        spaces: 2,
        encoding: 'utf-8',
      });
    }
    console.log('build success');
  }
}

export async function build(opts: BuildOptions) {
  const config: BuildOptions = {
    ...opts,
    staticDir: path.resolve(opts.staticDir),
    root: opts.root,
    output: path.resolve(opts.output ?? 'dist'),
    vercel: opts.vercel,
    entry: opts.entry,
  };
  console.log('VERCEL', process.env.VERCEL);
  console.log('config', config);
  const builder = new Builder(config);
  await builder.build();
}
