module.exports = {
    apps: [
      {
        name: 'pedidosAppFrontend',
        script: 'src/App.jsx', 
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