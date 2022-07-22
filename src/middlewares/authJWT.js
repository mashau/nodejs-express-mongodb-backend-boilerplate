import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
       return res.status(403).send({
            message: 'No token provided!'
        })
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            })
        }

        req.context.currentUserId = decoded.id
        next();
    });
}

const isAuthenticatedAndAdmin = async (req, res, next) => {
    const user = await req.context.models.User.findById(
        req.context.currentUserId
    )
        .exec(async(err, user) => {

            if (err) {
                return res.status(500).send({
                    message: 'Unable to validate user role!'
                })
            }

            const roles = await req.context.models.Role.find({
                _id: { $in: user.roles }
            })

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

           return res.status(403).send({
                message: 'Require admin role!'
            })
        })
}

const isAuthenticatedAndEditor = async (req, res, next) => {

    const user = await req.context.models.User.findById(
        req.context.currentUserId)
        .exec(async (err, user) => {

            if (err) {
                return res.status(500).send({
                    message: 'Unable to validate user role!'
                })
            }

            const roles = await req.context.models.Role.find({
                _id: { $in: user.roles }
            })

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'editor') {
                    next();
                    return;
                }
            }

            return res.status(403).send({
                message: 'Require editor role!'
            })
        })
}

const authJWT = {
    verifyToken,
    isAuthenticatedAndAdmin,
    isAuthenticatedAndEditor
}

export default authJWT;