
const esbuild = require('esbuild');
const { cp } = require('fs/promises');

// esbuild configuration
const buildOptions = {
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: { '.tsx': 'tsx' },
  platform: 'browser',
  // Mark these packages as external to prevent esbuild from bundling them.
  // They will be loaded by the browser via the importmap in index.html.
  external: [
    'react',
    'react-dom/client',
    '@google/genai',
  ],
  // Define the process.env.API_KEY variable for use in the frontend code.
  // It's sourced from the environment variable set in Netlify.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
};

async function build() {
  try {
    // Run the esbuild build process
    await esbuild.build(buildOptions);
    // Copy the main HTML file to the distribution folder
    await cp('index.html', 'dist/index.html');
    console.log('✅ Build successful!');
  } catch (e) {
    console.error('❌ Build failed:', e);
    process.exit(1);
  }
}

// Execute the build function
build();
