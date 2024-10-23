const withTM = require('next-transpile-modules')(['pdfjs-dist']);

const nextConfig = withTM({
  output: 'export',
  images: {
    unoptimized: true, // Убедитесь, что вам действительно нужно это
  },
  trailingSlash: true,
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Отключаем минификацию только для клиентской сборки
    if (!isServer) {
      config.optimization.minimize = true; // Убедитесь, что это включено для продакшн сборки
    }

    // Настройки для работы с PDF
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[contenthash].[ext]',
            publicPath: '/_next/static/worker',
            outputPath: 'static/worker',
          },
        },
      ],
    });

    // Поддержка CSS
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    return config;
  },
});

module.exports = nextConfig;
