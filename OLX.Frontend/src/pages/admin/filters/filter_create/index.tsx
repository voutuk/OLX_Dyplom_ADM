import { Button, Drawer, Form, Input, Space } from "antd";
import { IFilter } from "../../../../models/filter";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { useCreateFilterMutation } from "../../../../redux/api/filterAuthApi";


interface FilterCreateProps {
    open: boolean,
    onClose: () => void
    filter?: IFilter
}

const AdminFilterCreate: React.FC<FilterCreateProps> = ({ open, onClose, filter }) => {
    const [form] = Form.useForm();
    const [createFilter] = useCreateFilterMutation();
    const onFinish = async (data: any) => {
        if (filter) {

        }
        else {
            const result = await createFilter({ name: data.name, values: data.values })
            if (!result.error) {
                toast(`Фільтер успішно створений`, {
                    type: 'info'
                })
                onDriwerClose();
            }
        }
        // onDriwerClose();
    };
    const onDriwerClose = () => {
        form.resetFields()
        onClose()
    }

    const handleSubmit = () => {
        form.submit();
    };

    return (
        <Drawer
            open={open}
            title={filter ? "Редагувати" : "Створити"}
            onClose={onDriwerClose}
            styles={{
                body: {
                    paddingBottom: 80,
                    width: '100%'
                },
                header: {
                    width: '100%',
                    backgroundColor: 'ButtonShadow',
                    height: 50
                }
            }}
            extra={
                <Space>
                    <Button size="small" onClick={onDriwerClose}>Відмінити</Button>
                    <Button size="small" onClick={handleSubmit} type="primary">
                        Зберегти
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="filterForm"
                onFinish={onFinish}
                layout="vertical"
                className="w-[96%] mx-auto"
                initialValues={{
                    values: filter?.values.map(x => x.value) || [],
                    name: filter?.name || ''
                }}
            >
                <Form.Item
                    label="Назва фільтру"
                    validateTrigger={['onChange', 'onBlur']}
                    name='name'
                    className="mb-5"
                    rules={[
                        {
                            required: true,
                            message: "Будьласка введіть назву фільтру",
                        },
                    ]}
                >
                    <Input
                        className="flex-1"
                        size="small"
                        placeholder="Назва фільтру" />
                </Form.Item>
                <Form.List
                    name="values"
                    rules={[
                        {
                            validator: async (_, values) => {
                                if (!values || values.length < 1) {
                                    return Promise.reject(new Error('Додайте хоча б одне значення'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            <span>Значення фільтру:</span>
                            <Form.Item>
                                <Button
                                    className="w-full"
                                    size="small"
                                    type="dashed"
                                    onClick={() => add('', 0)}
                                    icon={<PlusOutlined />}
                                >
                                    Нове значення
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                            {fields.map((field) => (

                                <Form.Item
                                    required={false}
                                    key={field.name}
                                    className="flex-1"
                                >
                                    <div className="flex gap-2">
                                        <Form.Item
                                            {...field}
                                            key={field.key}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Будьласка введіть значення фільтру або видаліть",
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator() {
                                                        const values = getFieldValue('values') as string[]
                                                        const duplExist = values.some((item) => values.lastIndexOf(item) !== values.indexOf(item))
                                                        if (duplExist) {
                                                            return Promise.reject(new Error('Таке значення вже існує'));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                }),
                                            ]}
                                            noStyle
                                        >
                                            <Input className="flex-1" size="small" placeholder="Значення фільтру" />
                                        </Form.Item>
                                        {fields.length > 0 ? (
                                            <MinusCircleOutlined
                                                className="text-lg text-red-700 "
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </div>
                                </Form.Item>
                            ))}
                        </>
                    )}
                </Form.List>
            </Form>
        </Drawer>)
};

export default AdminFilterCreate;