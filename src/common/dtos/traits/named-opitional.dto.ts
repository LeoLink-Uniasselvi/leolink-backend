import { PartialType } from '@nestjs/swagger';
import { NamedDto } from './named.dto';
export class NamedOptionalDto extends PartialType(NamedDto) {}
