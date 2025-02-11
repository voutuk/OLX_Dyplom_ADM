import React, { useMemo, useRef, useState } from "react";
import { Upload, Image, UploadProps, UploadFile } from "antd";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove} from "@dnd-kit/sortable";
import { FileType } from "../../utilities/common_funct";
import imageCompression from "browser-image-compression";
import { PlusOutlined } from '@ant-design/icons';
import { UploadWithDndProps } from "./props";
import SortableImage from "./sortable_image";


const UploadWithDnd: React.FC<UploadWithDndProps> = ({ uploadSize, className, maxCount = 5, defaultCount = 4 ,columns = 5 ,rowHeight = 10}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const uploadRef = useRef<any>(null);

    const onChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        for (let index = 0; index < newFileList.length; index++) {
            if (!newFileList[index].thumbUrl) {
                const smallFile = await imageCompression(newFileList[index].originFileObj as FileType, { maxWidthOrHeight: 200 })
                newFileList[index].thumbUrl = URL.createObjectURL(smallFile)
            }
        }
        setFileList(newFileList);
    }

    const handlePreview = async (previev: string) => {
        setPreviewImage(previev);
        setPreviewOpen(true);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || !fileList.some((item) => item.uid === active.id)) {
            return;
        }

        if (active.id !== over.id) {
            const oldIndex = fileList.findIndex((item) => item.uid === active.id);
            const newIndex = fileList.findIndex((item) => item.uid === over.id);
            setFileList(arrayMove(fileList, oldIndex, newIndex));
        }
    };

    const onRemove = (uid: string | undefined) => {
        setFileList((prev) => prev.filter(x => x.uid !== uid));
    }

    const openFileDialog = () => {
        if (uploadRef.current) {
            uploadRef.current?.upload.uploader.fileInput.click();
        }
    };

    const defaultLoaders = useMemo(() => {
        const loaders = fileList.length < defaultCount
            ? Array.from({ length: defaultCount - fileList.length }).map((_, index) =>
                <div onClick={openFileDialog} key={index} className={`flex  flex-shrink-0 bg-white items-center cursor-pointer justify-center border border-[#9B7A5B] border-opacity-50 rounded-lg h-[100%] aspect-[16/16]`} style={{ width: uploadSize, height: uploadSize }}>
                    <PlusOutlined className="font-montserrat text-[#9B7A5B] text-opacity-50 text-adaptive-advert-page-price-text" />
                </div>)
            : []
        const loader = fileList.length < maxCount &&
            <div onClick={openFileDialog} className={`flex flex-col flex-shrink-0 gap-0 justify-center cursor-pointer text-center bg-[#9B7A5B] bg-opacity-20 rounded-lg h-[100%] aspect-[16/16]`} style={{ width: uploadSize, height: uploadSize }}>
                <span className="font-montserrat  text-adaptive-1_7_text">Додати ще</span>
                <span className="font-montserrat  text-adaptive-1_7_text">фото</span>
            </div>

        return [...loaders, loader]
    }, [fileList.length, defaultCount, maxCount])
    
    const uploadedImages = useMemo(() => {
        const images = fileList.length > 0 ? fileList.map(file => 
        <SortableImage
            onDelete={onRemove}
            onPreview={handlePreview}
            key={file?.uid}
            file={file}
            uploadSize={uploadSize} />) : []

        return [...images, ...defaultLoaders]
    }, [fileList])

    return (
        <>
            <Upload
                ref={uploadRef}
                fileList={fileList}
                multiple
                accept=".jpg,.png,.webp,.jpeg"
                onChange={onChange}
                beforeUpload={() => false}
                showUploadList={false}
            />

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fileList.map((file) => file?.uid)}>
                    <div className={`grid  ${className}`} style={{ gridTemplateColumns: `repeat(${columns},${rowHeight}vh)` }}>
                        {...uploadedImages}
                    </div>
                </SortableContext>
            </DndContext >

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}

        </>
    );
};




export default UploadWithDnd;