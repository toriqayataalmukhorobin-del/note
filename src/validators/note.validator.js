export const validateNote = (title) => {
    if (!title || title.trim() === "") {
        return {
            valid: false,
            message: "Title wajib diisi"
        };
    }

    if (title.length < 3) {
        return {
            valid: false,
            message: "Title minimal 3 karakter"
        };
    }

    if (title.length > 100) {
        return {
            valid: false,
            message: "Title maksimal 100 karakter"
        };
    }

    return {
        valid: true
    };
};