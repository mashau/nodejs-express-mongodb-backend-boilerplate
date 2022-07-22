const publicArea = (req, res) => {
    res.status(200).send("Available to public.");
};

const userArea = (req, res) => {
    res.status(200).send("Available to users.");
};

const adminArea = (req, res) => {
    res.status(200).send("Available to admin.");
};

const editorArea = (req, res) => {
    res.status(200).send("Available to editor.");
};

const testController = {
    publicArea,
    userArea,
    adminArea,
    editorArea
}

export default testController;