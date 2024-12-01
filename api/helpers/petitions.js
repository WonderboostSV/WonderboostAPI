const Validator = require('validator')
// Validar el cuerpo de la petición
const validateBody = (req, res, next) => {
    try {
        req.body = Validator.validateForm(req.body);
        next();
    } catch (err) {
        res.status(400).json({ status: 0, error: err.message });
    }
};

// Validar cuerpo de acciones
const validateAction = (validActions) => (req, res, next) => {
    const { action } = req.query;

    // Verificar si `action` está definido
    if (!action) {
        return res.status(400).json({
            status: 0,
            error: 'El parámetro "action" es requerido.',
        });
    }

    // Verificar si `action` está dentro de las acciones válidas
    if (!validActions.includes(action)) {
        return res.status(400).json({
            status: 0,
            error: `La acción "${action}" no es válida. Acciones permitidas: ${validActions.join(', ')}.`,
        });
    }

    // Si pasa la validación, continuar con el siguiente middleware
    next();
};

module.exports = {validateBody,validateAction};
