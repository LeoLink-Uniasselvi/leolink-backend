#!/bin/bash

# Script para corrigir erros de TypeScript no backend

echo "🔧 Corrigindo erros de TypeScript..."

# 1. Corrigir imports de ICommentRepository para usar 'import type'
find ./src/modules/comments/use-cases -name "*.ts" -type f -exec sed -i 's/import { CommentRepository, ICommentRepository }/import { CommentRepository, type ICommentRepository }/g' {} \;

echo "✅ Imports do ICommentRepository corrigidos"

# 2. Corrigir post-data.dto.ts para estender corretamente
cat > ./src/modules/posts/dtos/post-data.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from '@/common/dtos';

class PostAuthorDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: 'joao@example.com' })
  email!: string;
}

export class PostDataDto extends BaseEntityDto {
  @ApiProperty({
    description: 'Conteúdo do post',
    example: 'Este é o conteúdo do meu primeiro post!',
  })
  content!: string;

  @ApiProperty({
    description: 'ID do autor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  authorId!: string;

  @ApiProperty({
    description: 'Dados do autor',
    type: PostAuthorDto,
  })
  author!: PostAuthorDto;

  @ApiProperty({ description: 'Data de exclusão (soft delete)', nullable: true, required: false })
  deletedAt?: Date | null;
}
EOF

echo "✅ post-data.dto.ts corrigido"

# 3. Corrigir index-posts.response.dto.ts
cat > ./src/modules/posts/dtos/index-posts/index-posts.response.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationMetaDto } from '@/common/dtos';
import { PostDataDto } from '../post-data.dto';

export class IndexPostsResponseDto extends PaginatedResponseDto<PostDataDto> {
  constructor(items: PostDataDto[], meta: PaginationMetaDto) {
    super(items, meta, 'Posts recuperados com sucesso');
  }
}
EOF

echo "✅ index-posts.response.dto.ts corrigido"

# 4. Corrigir exceções do módulo posts
cat > ./src/modules/posts/exceptions/index.ts << 'EOF'
import { DomainException } from '@/common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class PostNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Post com ID '${id}' não encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class PostAlreadyDeletedException extends DomainException {
  constructor(id: string) {
    super(`Post com ID '${id}' já foi deletado`, HttpStatus.GONE);
  }
}

export class UnauthorizedPostAccessException extends DomainException {
  constructor() {
    super('Você não tem permissão para acessar este post', HttpStatus.FORBIDDEN);
  }
}
EOF

echo "✅ Exceções corrigidas"

# 5. Corrigir create-post.response.dto.ts
cat > ./src/modules/posts/dtos/create-post/create-post.response.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos';
import { PostDataDto } from '../post-data.dto';
import { HttpStatus } from '@nestjs/common';

export class CreatePostResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: PostDataDto })
  declare data: PostDataDto;

  constructor(post: PostDataDto) {
    super(post, 'Post criado com sucesso', HttpStatus.CREATED);
  }
}
EOF

echo "✅ create-post.response.dto.ts corrigido"

# 6. Corrigir get-post.response.dto.ts
cat > ./src/modules/posts/dtos/get-post/get-post.response.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos';
import { PostDataDto } from '../post-data.dto';
import { HttpStatus } from '@nestjs/common';

export class GetPostResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: PostDataDto })
  declare data: PostDataDto;

  constructor(post: PostDataDto) {
    super(post, 'Post recuperado com sucesso', HttpStatus.OK);
  }
}
EOF

echo "✅ get-post.response.dto.ts corrigido"

# 7. Corrigir update-post.response.dto.ts
cat > ./src/modules/posts/dtos/update-post/update-post.response.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dtos';
import { PostDataDto } from '../post-data.dto';
import { HttpStatus } from '@nestjs/common';

export class UpdatePostResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: PostDataDto })
  declare data: PostDataDto;

  constructor(post: PostDataDto) {
    super(post, 'Post atualizado com sucesso', HttpStatus.OK);
  }
}
EOF

echo "✅ update-post.response.dto.ts corrigido"

# 8. Corrigir delete-post.response.dto.ts
cat > ./src/modules/posts/dtos/delete-post/delete-post.response.dto.ts << 'EOF'
import { HttpStatus } from '@nestjs/common';
import { SuccessResponseDto } from '@/common/dtos';

export class DeletePostResponseDto extends SuccessResponseDto {
  constructor() {
    super(null, 'Post deletado com sucesso', HttpStatus.OK);
  }
}
EOF

echo "✅ delete-post.response.dto.ts corrigido"

echo ""
echo "✨ Todos os arquivos corrigidos!"
echo "Agora execute: docker-compose up -d"
