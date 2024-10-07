const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

const crearToken = (usuario, secreta,expiresIn) => {
    const{id, email, nombre} = usuario;

    return jwt.sign({id,email, nombre},secreta,{expiresIn});
}

const resolvers ={
    Query : {
        obtenerUsuario: async (_, __, context) => {
            const { usuario } = context;
            if (!usuario) {
              throw new Error('No autenticado');
            }
            const usuarioData = await Usuario.findById(usuario.id);
            return usuarioData;
          },
    },
    Mutation : {
        crearUsuario : async (_,{input}) => {
            const { email, password } = input;

            const existeUsuario = await Usuario.findOne({email});

            if (existeUsuario){
                throw new Error('El usuario ya está registrado')
            }

            try{
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);
                
                const nuevoUsuario = new Usuario(input);
                //console.log(nuevoUsuario);

                nuevoUsuario.save();
                return "Usuario creado correctamente";
            }catch (error){
                console.log(error);
            }
        },
        autenticarUsuario:  async (_,{input}) => {
            const { email, password } = input;

            const existeUsuario = await Usuario.findOne({email});

            if (!existeUsuario){
                throw new Error('El usuario no existe');
            }

            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);

            if(!passwordCorrecto){
                throw new Error('Password incorrecto');
            }
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '2hr'),
                user: {
                    nombre: existeUsuario.nombre,
                    email: existeUsuario.email,
                    etiqueta: existeUsuario.etiqueta
                }

            }

        },


        actualizarUsuario: async (_, { input }, context) => {
            const { usuario } = context;
            if (!usuario) {
                throw new Error('No autenticado');
            }

            const { nombre, password, etiqueta } = input;

            try {
                const actualizarUsuario = {};

                if (nombre) actualizarUsuario.nombre = nombre;
                if (password) {
                    const salt = await bcryptjs.genSalt(10);
                    actualizarUsuario.password = await bcryptjs.hash(password, salt);
                }
                if (etiqueta) actualizarUsuario.etiqueta = etiqueta;

                await Usuario.findByIdAndUpdate(usuario.id, actualizarUsuario, { new: true });
                return "Usuario actualizado correctamente";
            } catch (error) {
                console.log(error);
                throw new Error('Hubo un error al actualizar el usuario');
            }
        },

    }
}

module.exports = resolvers;