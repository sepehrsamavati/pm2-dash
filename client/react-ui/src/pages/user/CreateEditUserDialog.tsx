import { Autocomplete, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select, Stack } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { Add, Close, Delete } from "@mui/icons-material";
import UIText from "../../core/i18n/UIText";
import Button from "../../components/Button";
import { Permission } from "../../types/enums";
import { useSession } from "../../core/Session";
import { AccountType } from "../../types/enums";
import { UserInfoViewModel } from "@/common/types/user";
import TextField from "../../components/inputs/TextField";
import SelectOption from "../../components/inputs/SelectOption";
import { formHookBaseConfig } from "../../core/config/formHook";
import { ICreateUserDTO, IEditUserDTO } from "@/common/types/dto";
import { getPermissionUIText } from "../../core/helpers/getEnumUIText";
import { getEnumValues } from "../../core/helpers/getEnumSelectOptions";
import FormValidationHelper from "../../core/helpers/FormValidationHelper";
import { ForwardedRef, forwardRef, useCallback, useId, useImperativeHandle, useRef, useState } from "react";

type FormType = ICreateUserDTO & IEditUserDTO;

const validations = {
    username: new FormValidationHelper<FormType, "username">().isRequired().minLength(3).maxLength(12).resolve(),
    password: new FormValidationHelper<FormType, "password">().isRequired().maxLength(32).resolve(),
    type: new FormValidationHelper<FormType, "type">().isRequired().isNumber().resolve(),

    processName: new FormValidationHelper<FormType, "username">().isRequired().maxLength(32).resolve(),
} as const;

export type CreateEditUserDialogRef = {
    openCreateForm: () => void;
    openEditForm: (user: UserInfoViewModel) => void;
};


const CreateEditUserDialog = forwardRef((props: {
    afterUpsert: () => void;
}, ref: ForwardedRef<CreateEditUserDialogRef>) => {
    const session = useSession();
    const titleId = useId();
    const descriptionId = useId();
    const formId = useId();
    const [isEdit, setIsEdit] = useState(false);
    const [show, setShow] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<FormType>({
        ...formHookBaseConfig,
        defaultValues: {
            username: "",
            password: "",
            type: AccountType.Member,
            processPermissions: [],
        },
        shouldUnregister: !show,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [passwordRepeatMismatch, setPasswordRepeatMismatch] = useState(false);
    const processPermissions = useFieldArray<FormType>({
        control: form.control,
        name: "processPermissions" satisfies keyof IEditUserDTO
    });

    const dispose = useCallback(() => {
        setShow(false);
        setIsEdit(false);
        setPasswordRepeat("");
        setPasswordRepeatMismatch(false);
        form.reset({
            username: "",
            password: "",
            type: AccountType.Member,
            processPermissions: [],
        });
    }, [form]);

    const submit = useCallback((dto: FormType) => {
        if (passwordRepeatMismatch)
            return;
        setIsLoading(true);
        (isEdit ? window.electronAPI.users.edit(dto as IEditUserDTO) : window.electronAPI.users.create(dto as ICreateUserDTO))
            .then(res => {
                if (res.ok) {
                    dispose();
                    props.afterUpsert();
                } else {
                    console.log(res)
                }
            })
            .finally(() => setIsLoading(false));
    }, [isEdit, props, dispose, passwordRepeatMismatch]);

    useImperativeHandle(ref, () => ({
        openCreateForm: () => {
            setShow(true);
        },
        openEditForm: (user) => {
            form.setValue("id", user.id);
            form.setValue("username", user.username);
            form.setValue("type", user.type);
            form.setValue("processPermissions", user.processPermissions);
            setIsEdit(true);
            setShow(true);
        }
    }));

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={show}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                PaperProps={{
                    sx: {
                        backgroundImage: 'unset'
                    }
                }}
            >
                <DialogTitle id={titleId}>{isEdit ? UIText.editUser : UIText.createUser}</DialogTitle>
                <DialogContent>
                    <form id={formId} ref={formRef} onSubmit={form.handleSubmit(submit)}>
                        <Grid container padding={1} spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={UIText.username}
                                    form={formRef}
                                    inputProps={{ style: { textTransform: "lowercase" } }}
                                    defaultValue={form.getValues("username")}
                                    formRegister={form.register("username", validations.username)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectOption
                                    label={UIText.type}
                                    form={formRef}
                                    formInstance={{
                                        instance: form,
                                        fieldKey: "type"
                                    }}
                                    defaultValue={form.getValues("type")}
                                    value={undefined}
                                    formRegister={form.register("type", validations.type)}
                                    onChange={() => {
                                        form.unregister();
                                        form.setValue("processPermissions", []);
                                    }}
                                    options={[
                                        [AccountType.Manager, AccountType[AccountType.Manager]],
                                        [AccountType.Member, AccountType[AccountType.Member]]
                                    ]}
                                />
                            </Grid>
                            {isEdit ? null : (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={UIText.password}
                                            form={formRef}
                                            type="password"
                                            formRegister={form.register("password", validations.password)}
                                            onChange={e => setPasswordRepeatMismatch(e.target.value !== passwordRepeat)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label={UIText.repeatPassword}
                                            form={formRef}
                                            type="password"
                                            error={passwordRepeatMismatch}
                                            onChange={e => {
                                                const value = e.target.value;
                                                setPasswordRepeatMismatch(value !== form.getValues("password"));
                                                setPasswordRepeat(value);
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                            {form.getValues("type") === AccountType.Member ? (
                                <Grid item marginBlockStart={1} xs={12}>
                                    <Stack direction="column" spacing={1}>
                                        <Button
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                            startIcon={<Add />}
                                            fullWidth={false}
                                            onClick={() => {
                                                processPermissions.append({
                                                    processName: "",
                                                    permissions: [
                                                        Permission.ViewProcess
                                                    ]
                                                });
                                            }}
                                        >{UIText.addProcess}</Button>
                                        {processPermissions.fields.map((item, index) => (
                                            <Grid container key={index} alignItems="center">
                                                <Grid item xs={4}>
                                                    <Autocomplete
                                                        disablePortal
                                                        options={(session.pm2Connection?.cachedList ?? []).map(item => item.name)}
                                                        defaultValue={form.getValues(`processPermissions.${index}.processName` as const)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={UIText.processName}
                                                                error={Boolean(form.formState.errors?.processPermissions?.at ? form.formState.errors.processPermissions.at(index)?.processName?.message : false)}
                                                                formRegister={form.register(`processPermissions.${index}.processName` as const, validations.processName)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <FormControl sx={{ m: 1, width: 300 }}>
                                                        <InputLabel id="demo-multiple-chip-label">{UIText.permissions}</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-chip-label"
                                                            id="demo-multiple-chip"
                                                            multiple
                                                            value={item.permissions}
                                                            onChange={(e) => {
                                                                const { target: { value } } = e;
                                                                if (Array.isArray(value) && value.includes(Permission.ViewProcess))
                                                                    processPermissions.update(index, { ...item, permissions: value });
                                                            }}
                                                            input={<OutlinedInput id="select-multiple-chip" label={UIText.permissions} />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={getPermissionUIText(value)} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        // MenuProps={MenuProps}
                                                        >
                                                            {getEnumValues(Permission).map((num) => (
                                                                <MenuItem
                                                                    key={num}
                                                                    value={num}
                                                                >
                                                                    {getPermissionUIText(num)}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <IconButton
                                                        onClick={() => processPermissions.remove(index)}
                                                        color="error"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Stack>
                                </Grid>
                            ) : null}
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" disabled={isLoading} startIcon={<Close />} color="warning" onClick={dispose}>{UIText.close}</Button>
                    <Button variant="contained" isLoading={isLoading} color="success" form={formId} type="submit">{UIText.submit}</Button>
                </DialogActions>
            </Dialog >
        </>
    );
});

export default CreateEditUserDialog;
