-- =====================================================
-- Script de Dados de Teste - HOMOLOGAÇÃO
-- Data: 01/11/2025
-- Autor: Felippe Luiz Menin
-- =====================================================

-- =====================================================
-- INSERIR USUÁRIO DE TESTE ÚNICO - FELIPPE
-- =====================================================

-- Criar usuário para testes
INSERT INTO users (id, name, email, password, "createdAt", "updatedAt") 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Felippe', 'felippe@leolink.com', '$2b$10$hashedpassword1', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- RELACIONAMENTOS DE FOLLOW 
-- =====================================================

-- Cenário: interação
INSERT INTO follows (follower_id, followee_id, created_at) 
VALUES 
    -- Felippe segue o Admin
    ('550e8400-e29b-41d4-a716-446655440001', '019a425a-fc88-77dc-bcf0-c53a27210e85', NOW() - INTERVAL '1 day'),
    
    -- Admin segue Felippe de volta (relacionamento mútuo)
    ('019a425a-fc88-77dc-bcf0-c53a27210e85', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '12 hours')
ON CONFLICT (follower_id, followee_id) DO NOTHING;

-- =====================================================