import {z} from "zod";

const HIGHLIGHT_COLORS = z.enum(["default", "white", "red", "green", "blue", "yellow", "black"])
const TEXT_COLOR = z.enum(["default", "white", "red", "green", "blue", "yellow", "black"])

const UserValidator = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    pages: z.array(z.string())
})

const PageValidator = z.object({
    type: z.string().startsWith("page").max(4),
    properties: z.object({
        title: z.string(),
        icon: z.string(),
        created: z.date(),
        created_by: z.string()
    }),
    content: z.array(z.string())
})

const UpdatePageValidator = z.object({
    title: z.string(),
    icon: z.string(),
})

const TextValidator = z.object({
        type: z.string(),
        properties: z.object({
            type_face: z.array(z.string()),
            color: TEXT_COLOR,
            highlight: HIGHLIGHT_COLORS
        }),
        value: z.string(),
        parent: z.object({
            id: z.string().min(24).max(24),
            type: z.string()
        })
    }
)

const UpdateTextValidator = z.object({
    type_face: z.array(z.string()),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    value: z.string()
})

const CalloutValidator = z.object({
        type: z.string(),
        properties: z.object({
            type_face: z.array(z.string()),
            color: TEXT_COLOR,
            highlight: HIGHLIGHT_COLORS,
            icon: z.string()
        }),
        value: z.string(),
        parent: z.object({
            id: z.string().min(24).max(24),
            type: z.string()
        })
    }
)

const UpdateCalloutValidator = z.object({
    type_face: z.array(z.string()),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    icon: z.string(),
    value: z.string()
})

const ListValidator = z.object({
    type: z.string(),
    properties: z.object({
        type_face: z.array(z.string()),
        color: TEXT_COLOR,
        highlight: HIGHLIGHT_COLORS,
    }),
    content: z.array(z.string()),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
})

const UpdateListValidator = z.object({
    type_face: z.array(z.string()),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    value: z.string()
})

const TodoValidator = z.object({
    type: z.string(),
    properties: z.object({
        type_face: z.array(z.string()),
        color: TEXT_COLOR,
        highlight: HIGHLIGHT_COLORS,
        checked: z.boolean()
    }),
    content: z.array(z.string()),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
})

const UpdateTodoValidator = z.object({
    type_face: z.array(z.string()),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    checked: z.boolean(),
    value: z.string()
})

const ImageValidator = z.object({
    type: z.string(),
    properties: z.object({
        caption: z.string(),
        align: z.string(),
    }),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
})

const UpdateImageValidator = z.object({
    caption: z.string(),
    align: z.string(),
    value: z.string(),
})

const EquationValidator = z.object({
    type: z.string(),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
})

const UpdateEquationValidator = z.object({
    value: z.string(),
})

export { UserValidator, PageValidator, UpdateTextValidator, UpdateCalloutValidator, UpdateEquationValidator, UpdateImageValidator, UpdateTodoValidator, UpdateListValidator, UpdatePageValidator, TextValidator, CalloutValidator, ListValidator, TodoValidator, ImageValidator, EquationValidator}