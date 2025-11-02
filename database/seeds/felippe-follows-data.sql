-- =====================================================
-- Script de Dados de Teste para Tabela FOLLOWS - FELIPPE
-- Dados personalizados com usuários realistas
-- Data: 01/11/2025
-- =====================================================

-- =====================================================
-- INSERIR USUÁRIOS DE TESTE (se necessário)
-- =====================================================

-- Criar usuários de teste com a estrutura correta da tabela users
INSERT INTO users (id, name, email, password, "createdAt", "updatedAt") 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Felippe', 'felippe@leolink.com', '$2b$10$hashedpassword1', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Maria Silva', 'maria@leolink.com', '$2b$10$hashedpassword2', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'João Santos', 'joao@leolink.com', '$2b$10$hashedpassword3', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', 'Ana Costa', 'ana@leolink.com', '$2b$10$hashedpassword4', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440005', 'Carlos Oliveira', 'carlos@leolink.com', '$2b$10$hashedpassword5', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- INSERIR RELACIONAMENTOS DE FOLLOW - FELIPPE COMO PROTAGONISTA
-- =====================================================

INSERT INTO follows (follower_id, followee_id, created_at) 
VALUES 
    -- Felippe segue outros usuários
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 days'), -- Felippe segue Maria
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '1 day'),  -- Felippe segue João
    ('550e8400-e29b-41d4-a716-446655440001', '019a425a-fc88-77dc-bcf0-c53a27210e85', NOW() - INTERVAL '3 hours'), -- Felippe segue Admin
    
    -- Outros usuários seguem Felippe (ele é popular!)
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days'),  -- Maria segue Felippe
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '4 days'),  -- João segue Felippe
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '6 hours'), -- Ana segue Felippe
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 hour'),  -- Carlos segue Felippe
    ('019a425a-fc88-77dc-bcf0-c53a27210e85', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 hours'), -- Admin segue Felippe
    
    -- Relacionamentos entre outros usuários  
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '12 hours'), -- Maria segue João
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '8 hours'),  -- João segue Ana
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '3 days'),   -- Ana segue Carlos
    
    -- Relacionamentos mútuos (amizades com Felippe)
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '2 days')   -- Carlos segue Ana
ON CONFLICT (follower_id, followee_id) DO NOTHING;

-- =====================================================
-- QUERIES PARA VISUALIZAR OS DADOS DO FELIPPE
-- =====================================================

-- 1. Perfil do Felippe
SELECT 
    'PERFIL DO FELIPPE' as info,
    id,
    name,
    email,
    "createdAt"
FROM users 
WHERE name = 'Felippe';

-- 2. Seguidores do Felippe
SELECT 
    'SEGUIDORES DO FELIPPE' as info,
    u.name as follower_name,
    u.email as follower_email,
    f.created_at as seguindo_desde
FROM follows f
JOIN users u ON f.follower_id = u.id
WHERE f.followee_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY f.created_at DESC;

-- 3. Quem o Felippe está seguindo
SELECT 
    'FELIPPE ESTÁ SEGUINDO' as info,
    u.name as following_name,
    u.email as following_email,
    f.created_at as seguindo_desde
FROM follows f
JOIN users u ON f.followee_id = u.id
WHERE f.follower_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY f.created_at DESC;

-- 4. Estatísticas do Felippe
SELECT 
    'ESTATÍSTICAS DO FELIPPE' as info,
    (SELECT COUNT(*) FROM follows WHERE followee_id = '550e8400-e29b-41d4-a716-446655440001') as total_seguidores,
    (SELECT COUNT(*) FROM follows WHERE follower_id = '550e8400-e29b-41d4-a716-446655440001') as total_seguindo,
    (SELECT COUNT(*) FROM follows) as total_relacionamentos_geral;

-- 5. Relacionamentos mútuos com Felippe
SELECT 
    'AMIZADES MÚTUAS DO FELIPPE' as info,
    u.name as amigo_mutuo,
    u.email
FROM follows f1
JOIN follows f2 ON f1.follower_id = f2.followee_id AND f1.followee_id = f2.follower_id
JOIN users u ON f1.followee_id = u.id
WHERE f1.follower_id = '550e8400-e29b-41d4-a716-446655440001'
  AND f1.followee_id != '550e8400-e29b-41d4-a716-446655440001';