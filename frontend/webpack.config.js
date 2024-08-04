const path = require('path');

module.exports = {
  entry: './src/index.js', // Punto de entrada de tu aplicación
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // Ruta de salida
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Archivos JS o JSX
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Archivos CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Archivos de imagen
        type: 'asset/resource',
      },
      {
        test: /\.worker\.js$/, // Archivos de trabajadores
        use: { loader: 'worker-loader', options: { inline: true } },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolución de extensiones
    fallback: {
      fs: false,
      path: false,
      os: false,
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // Carpeta de contenido
    compress: true, // Compresión
    port: 3000, // Puerto del servidor
    historyApiFallback: true, // Manejo de rutas
  },
};const path = require('path');

module.exports = {
  entry: './src/index.js', // Punto de entrada de tu aplicación
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // Ruta de salida
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Archivos JS o JSX
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Archivos CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Archivos de imagen
        type: 'asset/resource',
      },
      {
        test: /\.worker\.js$/, // Archivos de trabajadores
        use: { loader: 'worker-loader', options: { inline: true } },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolución de extensiones
    fallback: {
      fs: false,
      path: false,
      os: false,
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // Carpeta de contenido
    compress: true, // Compresión
    port: 3000, // Puerto del servidor
    historyApiFallback: true, // Manejo de rutas
  },
};