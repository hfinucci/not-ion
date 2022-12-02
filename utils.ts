import {
    CalloutValidator,
    EquationValidator,
    ImageValidator,
    ListValidator,
    TextValidator,
    TodoValidator,
    UpdateCalloutValidator, UpdateEquationValidator,
    UpdateImageValidator,
    UpdateListValidator,
    UpdateTextValidator,
    UpdateTodoValidator,
} from "./schemaValidation";
import {ZodObject} from "zod";

const validTypes = ["text", "h1", "h2", "h3", "quote", "callout", "bullet", "toggle", "todo", "image", "equation"]

const blockValidatorHash = new Map<string, ZodObject<any>>([
    ["text", TextValidator],
    ["h1", TextValidator],
    ["h2", TextValidator],
    ["h3", TextValidator],
    ["quote", TextValidator],
    ["callout", CalloutValidator],
    ["bullet", ListValidator],
    ["toggle", ListValidator],
    ["todo", TodoValidator],
    ["image", ImageValidator],
    ["equation", EquationValidator]
])

const blockUpdateValidatorHash = new Map<string, ZodObject<any>>([
    ["text", UpdateTextValidator],
    ["h1", UpdateTextValidator],
    ["h2", UpdateTextValidator],
    ["h3", UpdateTextValidator],
    ["quote", UpdateTextValidator],
    ["callout", UpdateCalloutValidator],
    ["bullet", UpdateListValidator],
    ["toggle", UpdateListValidator],
    ["todo", UpdateTodoValidator],
    ["image", UpdateImageValidator],
    ["equation", UpdateEquationValidator]
])


export { validTypes, blockValidatorHash, blockUpdateValidatorHash }