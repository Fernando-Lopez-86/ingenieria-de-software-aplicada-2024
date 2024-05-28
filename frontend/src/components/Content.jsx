import React from 'react';
import Pedidos from './Pedidos'
// import Usuarios from './Usuarios'
// import Categorias from './Categorias'
// import CardCountProductos from './CardCountProductos'
// import CardCountUsuarios from './CardCountUsuarios'
// import CardCountCategory from './CardCountCategory'

function Content(){

    return(
        <React.Fragment>
				{/*<!-- Content Row Top -->*/}
				<div className="container-fluid">
                    
					{/*<!-- Content Row Movies-->*/}
					<div className="row">
                        {/* <CardCountProductos/>
                        <CardCountCategory/>
                        <CardCountUsuarios/> */}
                        <Pedidos/>
                        {/* <Categorias/>
                        <Usuarios/> */}
					</div>
				</div>
        </React.Fragment>
    )
}

export default Content;