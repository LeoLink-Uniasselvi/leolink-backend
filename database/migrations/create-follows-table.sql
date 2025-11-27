-- =====================================================
-- Script de Criação da Tabela FOLLOWS
-- Módulo de Relacionamentos entre Usuários (Seguidores)
-- Data: 01/11/2025
-- Autor: Felippe Luiz Menin
-- =====================================================

-- Criar tabela follows
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID NOT NULL,
    followee_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Chave primária composta
    CONSTRAINT pk_follows PRIMARY KEY (follower_id, followee_id),
    
    -- Foreign Keys
    CONSTRAINT fk_follows_follower 
        FOREIGN KEY (follower_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_follows_followee 
        FOREIGN KEY (followee_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Constraint para evitar auto-follow
    CONSTRAINT chk_no_self_follow 
        CHECK (follower_id != followee_id)
);

-- Índices para otimização de performance
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee_id ON follows(followee_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at);

-- Índice único composto (já existe pela PK, mas explícito para clareza)
CREATE UNIQUE INDEX IF NOT EXISTS idx_follows_unique_relationship 
ON follows(follower_id, followee_id);

-- Comentários nas tabelas e colunas
COMMENT ON TABLE follows IS 'Tabela de relacionamentos entre usuários (seguidores/seguindo)';
COMMENT ON COLUMN follows.follower_id IS 'ID do usuário que está seguindo';
COMMENT ON COLUMN follows.followee_id IS 'ID do usuário que está sendo seguido';
COMMENT ON COLUMN follows.created_at IS 'Data e hora de criação do relacionamento';

-- =====================================================
-- Fim do Script de Criação da Tabela FOLLOWS