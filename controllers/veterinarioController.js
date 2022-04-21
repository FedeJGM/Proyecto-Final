import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";

const registrar = async (req, res) => {

    const { email, nombre } = req.body;
    
    //Previniendo duplicates users
     
    const existeUsuario = await Veterinario.findOne({ email });
    
    if (existeUsuario) {
        const error = new Error("Usuario ya existente");
        return res.status(400).json({ msg: error.message });
    }

    try {
     //Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar el Correo
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado);

    } catch (error) {
        console.log(error);
    }
    
};

const perfil = (req, res) => {
    const { veterinario } = req;

    res.json({ perfil: veterinario });
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    }
        
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }

};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar usuario existe
    const usuario = await Veterinario.findOne({ email });
    
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario está confirmado

    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta aún no está confirmada");
        return res.status(403).json({ msg: error.message });
    }

    // Checking Password

    if (await usuario.comprobarPassword(password)) {
        // Autenticar Usuario
        res.json({ token: generarJWT(usuario.id) });

    } else {
        const error = new Error("La contraseña se incorrecta")
        return res.status(403).json({ msg: error.message });
    }


};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });
    if (!Veterinario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

     try {
         existeVeterinario.token = generarId()
         await existeVeterinario.save()
             res.json({msg: "Hemos enviado un email con las instrucciones"});
     } catch (error) {
         console.log(error);
     }

 };

const comprobarToken = async (req, res) => { 
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        //Token valido - Usuario existe
        res.json({ msg: "Token válido" });
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({ msg: error.message });
    }

};

const nuevoPassword = async (req, res) => {
    
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error("Hubo un error...");
        return res.status(400).json({ msg: error.message });
    }
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "Contraseña modificada correctamente" });
         } catch (error) {
             console.log(error);
         }

 };

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
};

