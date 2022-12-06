import {z} from "zod";

const HIGHLIGHT_COLORS = z.enum(["default", "red", "green", "blue", "yellow", "pink", "purple", "orange", "brown", "grey"]);
const TEXT_COLOR = z.enum(["default", "red", "green", "blue", "yellow", "pink", "purple", "orange", "brown", "grey"]);
const TYPE_FACE = z.enum(["bold", "italic","underline"]);
const ALIGN = z.enum(["left", "center", "right"]);

const UserValidator = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    pages: z.array(z.string())
}).strict()

const PageValidator = z.object({
    type: z.string().startsWith("page").max(4),
    properties: z.object({
        title: z.string(),
        icon: z.string(),
        created_by: z.string()
    }),
    content: z.array(z.string())
}).strict()

const UpdatePageValidator = z.object({
    title: z.string(),
    icon: z.string(),
}).strict()

const TextValidator = z.object({
        type: z.string(),
        properties: z.object({
            type_face: z.array(TYPE_FACE),
            color: TEXT_COLOR,
            highlight: HIGHLIGHT_COLORS
        }),
        value: z.string(),
        parent: z.object({
            id: z.string().min(24).max(24),
            type: z.string()
        })
    }
).strict()

const UpdateTextValidator = z.object({
    type: z.string(),
    type_face: z.array(TYPE_FACE),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    value: z.string()
}).strict()

const CalloutValidator = z.object({
        type: z.string(),
        properties: z.object({
            type_face: z.array(TYPE_FACE),
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
).strict()

const UpdateCalloutValidator = z.object({
    type_face: z.array(TYPE_FACE),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    icon: z.string(),
    value: z.string()
}).strict()

const ListValidator = z.object({
    type: z.string(),
    properties: z.object({
        type_face: z.array(TYPE_FACE),
        color: TEXT_COLOR,
        highlight: HIGHLIGHT_COLORS,
    }),
    content: z.array(z.string()),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
}).strict()

const UpdateListValidator = z.object({
    type_face: z.array(TYPE_FACE),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    value: z.string()
}).strict()

const TodoValidator = z.object({
    type: z.string(),
    properties: z.object({
        type_face: z.array(TYPE_FACE),
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
}).strict()

const UpdateTodoValidator = z.object({
    type_face: z.array(TYPE_FACE),
    color: TEXT_COLOR,
    highlight: HIGHLIGHT_COLORS,
    checked: z.boolean(),
    value: z.string()
}).strict()

const ImageValidator = z.object({
    type: z.string(),
    properties: z.object({
        caption: z.string(),
        align: ALIGN,
    }),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
}).strict()

const UpdateImageValidator = z.object({
    caption: z.string(),
    align: ALIGN,
    value: z.string(),
}).strict()

const EquationValidator = z.object({
    type: z.string(),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
}).strict()

const UpdateEquationValidator = z.object({
    value: z.string(),
}).strict()

export { UserValidator, PageValidator, UpdateTextValidator, UpdateCalloutValidator, UpdateEquationValidator, UpdateImageValidator, UpdateTodoValidator, UpdateListValidator, UpdatePageValidator, TextValidator, CalloutValidator, ListValidator, TodoValidator, ImageValidator, EquationValidator}