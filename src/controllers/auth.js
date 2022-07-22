import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (user, secret, expiration) => {
    return jwt.sign({ id: user._id, }, secret, {
        expiresIn: expiration
    })
}

const signUp = async (req, res) => {

    const user = await req.context.models.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    user.save(async (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        if (req.body.roles) {
            const role = await req.context.models.Role.find({
                name: { $in: req.body.roles }
            },
                (err, roles) => {
                    if (err) {
                        return res.statu(500).send({ message: err })
                    }

                    user.roles = roles.map(role => role._id);
                    user.save((err) => {
                        if (err) {
                           return res.status(500).send({ message: err })
                        }

                        const token = createToken(
                            user, process.env.SECRET, process.env.JWTEXPIRATION
                        )

                        const roles = [];
                        for (let i = 0; i < user.roles.length; i++) {
                            roles.push(user.roles[i].name);
                        }
                        res.status(200).send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles,
                            token
                        });
                    })
                });
        } else {
            const roles = req.context.models.Role.findOne({
                name: 'user'
            }, (err, role) => {
                if (err) {
                    return res.status(500).status({ message: err })
                }

                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        return res.status(500).status({ message: err })
                    }

                    const token = createToken(
                        user, process.env.SECRET, process.env.JWTEXPIRATION
                    )

                    const roles = [role.name];
                    res.status(200).send({
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        roles,
                        token
                    });

                })
            })
        }
    })
}

const signIn = async (req, res) => {
    const user = await req.context.models.User.findOne({
        username: req.body.login
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            if (!user) {
                return res.status(404).send({
                    message: "User Not found."
                });
            }

            const validPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).send({
                    token: null,
                    message: "Invalid username or password!"
                });
            }

            const token = createToken(
                user, process.env.SECRET, process.env.JWTEXPIRATION
            )

            const roles = [];
            for (let i = 0; i < user.roles.length; i++) {
                roles.push(user.roles[i].name);
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles,
                token
            });
        });
}

export default { signIn, signUp }