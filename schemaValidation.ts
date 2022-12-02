import {z} from "zod";

const HIGHLIGHT_COLORS = z.enum(["default", "white", "red", "green", "blue", "yellow", "black"])
const TEXT_COLOR = z.enum(["default", "white", "red", "green", "blue", "yellow", "black"])

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

const EquationValidator = z.object({
    type: z.string(),
    value: z.string(),
    parent: z.object({
        id: z.string().min(24).max(24),
        type: z.string()
    })
})

export {TextValidator, CalloutValidator, ListValidator, TodoValidator, ImageValidator, EquationValidator}