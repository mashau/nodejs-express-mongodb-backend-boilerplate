const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        //check if username exists
        let user = await req.context.models.User.findOne({
            username: req.body.username
        });

        if (user) {
            return res.status(400).send({
                message: 'Username is already in use!'
            });
        }

        //check if email exists
        user = await req.context.models.User.findOne({
            email: req.body.email
        });

        if (user) {
            return res.status(400).send({
                message: 'Email is already in use!'
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            message: 'Unable to validate username.'
        });
    }
}

const checkRolesExist = (req, res, next) => {
    const roles = req.body.roles;
    const existingRoles = req.context.models.Role.find();
    const Roles = [];

    for(i=0; i < existingRoles.length; i++){
        Roles[i] = existingRoles[i].name;
    }

    if(roles) {
        for(const j = 0; i < roles.length(); j++)
        if(!Roles.includes(req.body.roles[i])) {
            return res.status(400).send({
                message: 'Role does not exist = ' + req.body.roles[i]
            })
            return;
        }
    }

    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExist
}

export default verifySignUp;