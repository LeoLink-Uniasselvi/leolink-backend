import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';
import { Post } from '../../entities/post.entity';

@Injectable()
export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(content: string, authorId: string): Promise<Post> {
    console.log('[CreatePostUseCase] Executando:', { content, authorId });
    
    const post = new Post({ content, authorId });
    console.log('[CreatePostUseCase] Post instanciado:', { id: post.id, content: post.content, authorId: post.authorId });
    
    await this.postRepository.create(post);
    console.log('[CreatePostUseCase] Post salvo no DB:', { id: post.id });
    
    // Buscar o post criado com o autor
    const createdPost = await this.postRepository.findByIdWithAuthor(post.id);
    console.log('[CreatePostUseCase] Post buscado:', { found: !!createdPost, hasAuthor: !!createdPost?.author });
    
    if (!createdPost) {
      console.error('[CreatePostUseCase] ERRO: Post não encontrado após criação!');
      throw new Error('Post criado mas não encontrado no banco');
    }
    
    return createdPost;
  }
}
