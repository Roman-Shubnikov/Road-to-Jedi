export declare enum ImageTypesEnum {
    JPG = "image/jpg",
    JPEG = "image/jpeg",
    PNG = "image/png",
    WEBP = "image/webp"
}
export declare enum DocumentTypesEnum {
    DOC = "document"
}
export declare const allowedFileTypes: {
    JPG: ImageTypesEnum.JPG;
    JPEG: ImageTypesEnum.JPEG;
    PNG: ImageTypesEnum.PNG;
    WEBP: ImageTypesEnum.WEBP;
    DOC: DocumentTypesEnum.DOC;
};
export type allowedFileTypesType = DocumentTypesEnum | ImageTypesEnum;
