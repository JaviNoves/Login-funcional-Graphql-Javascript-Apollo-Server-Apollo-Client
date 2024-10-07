const { gql} = require('apollo-server');


const typeDefs = gql`

type Curso {
    titulo : String
    tecnologia : String

}

type Tecnologia { 
    tecnologia:String
}

type Query {   
    obtenerCursos : [Curso]
    obtenerUsuario: Usuario
    obtenerTecnologia : [Tecnologia]
    
}

input UsuarioInput{
    nombre:String!
    email:String!
    password: String!
    etiqueta: String!
}

input AutenticarInput{
    email:String!
    password: String!
}

input ActualizarUsuarioInput {
    nombre: String
    password: String
    etiqueta: String
}    

type Token{
    token :String
    user: Usuario
}

type Usuario {
    nombre: String
    email: String
    etiqueta: String
}

type Mutation {
    crearUsuario(input: UsuarioInput) : String
    autenticarUsuario( input: AutenticarInput) : Token
    actualizarUsuario(input: ActualizarUsuarioInput): String
}

`;

module.exports = typeDefs;