import decodeJwt from "../utils/decodeJwt.js";
import usuarioService from "../services/user.service.js" 
const getProfile = (req, res) => {
  res.status(200).send({
    message: " Perfil de usuario autenticado.",
    userId: req.userId,
  });
};
/** 
 * @swagger
 * /user/miperfil:
 *   patch:
 *     summary: Actualizar datos de perfil del usuario autenticado
 *     description: Método PATCH para actualizar el perfil del usuario. El ID del usuario se extrae del token de autenticación (sesión).
 *     tags:
 *       - Miperfil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               User: # Estructura anidada para req.body.User
 *                 type: object
 *                 $ref: "#/components/schemas/UsuarioUpdate"
 *     responses:
 *       "200":
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usuario actualizado correctamente"
 *                 updated:
 *                   type: object
 *                   $ref: "#/components/schemas/Usuario"
 *       "401":
 *         description: No autorizado (token ausente o inválido).
 *       "404":
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usuario no encontrado"
 *       "500":
 *         description: Error al actualizar los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "error al actualizar los datos del usuario"
*/
const updateUserData = async (req, res) =>{
    let tokenDecoded = decodeJwt(req);
    const documento_id = tokenDecoded.documento_id;
    const datosNuevosUsuario = req.body.User;
    console.log("datos del usuario: "+ JSON.stringify(datosNuevosUsuario));
    console.log("id del usuario"+documento_id);
    
    Object.keys(datosNuevosUsuario).forEach(
    key => datosNuevosUsuario[key] === undefined && delete datosNuevosUsuario[key]
    );
    try {
    const updated = await usuarioService.actualizarUsuario(documento_id, datosNuevosUsuario);

    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      usuario: updated
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar los datos del usuario",
      errorMensaje: error.message
    });
  }
}
export default {getProfile, updateUserData};