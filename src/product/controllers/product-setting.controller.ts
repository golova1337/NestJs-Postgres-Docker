import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { Size } from 'src/product/enum/multer-enum';
import { FilesUploadDto } from 'src/user-settings/dto/upload/Files-upload.dto';
import { RemoveProductFilesDto } from '../dto/removeImages/Remove-product-images.dto';
import { UpdateProductCategoryDto } from '../dto/update/Update-product-category.dto';
import { File } from '../entities/File.entity';
import { ProductSettingService } from '../services/product-setting.service';
import { UploadFileService } from '../services/upload-files.service';

@ApiBearerAuth()
@ApiTags('Products Setting')
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@Controller('product/:id/setting')
@UseGuards(RolesGuard)
export class ProductSettingController {
  constructor(private readonly productSettingService: ProductSettingService) {}
  @Post('images')
  @Roles('admin')
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: UploadFileService.localStore(),
        filename: UploadFileService.fileNameEditor,
      }),
    }),
  )
  @ApiOperation({
    summary: 'Uploading an image',
    description: 'An admin can upload files',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files of the product',
    type: FilesUploadDto,
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(FilesUploadDto) },
            },
          },
        },
      ],
    },
  })
  async upload(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: UploadFileService.imageFileFilter(),
        })
        .addMaxSizeValidator({
          maxSize: Size.Product,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<CommonResponseDto<File[]>> {
    const result: File[] = await this.productSettingService.upload(
      files,
      id,
      userId,
    );
    return CommonResponse.succsessfully({ data: result });
  }

  @Delete('images')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Removing an image',
    description: 'An admin can remove multiple files',
  })
  async remove(@Body() body: RemoveProductFilesDto): Promise<void> {
    const { ids } = body;
    await this.productSettingService.removeImages(ids);
    return;
  }
  @Patch('category')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Change the product category',
    description: 'If you an administartor, you can update the product category',
  })
  @ApiCreatedResponse({ type: CommonResponseDto, status: 204 })
  async updateCategoria(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<void> {
    const { category_id } = updateProductCategoryDto;
    const result: [affectedCount: number] =
      await this.productSettingService.updateCategory(+id, category_id);
    return;
  }
}
