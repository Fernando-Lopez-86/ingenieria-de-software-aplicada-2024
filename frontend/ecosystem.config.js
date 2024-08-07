module.exports = {
    apps: [
      {
        name: 'pedidosAppFrontend',
        script: 'src/App.jsx', // Asegúrate de que el camino al script sea correcto
      }
    ]
  };


// module.exports = {
//   apps: [
//     {
//       name: 'pedidosAppFrontend',
//       script: 'serve',
//       args: '-s build -l 3001',
//       env: {
//         NODE_ENV: 'development',
//       },
//     },
//   ],
// };