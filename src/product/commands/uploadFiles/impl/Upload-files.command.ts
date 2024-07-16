export class UploadFilesCommand {
  constructor(
    public readonly files: Array<Express.Multer.File>,
    public readonly product_id: string,
    public readonly author_id: string,
  ) {}
}
