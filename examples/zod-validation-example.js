/**
 * Exemplos de como testar a validação com Zod na API
 * 
 * Execute este arquivo com: node examples/zod-validation-example.js
 */

console.log('🧪 Exemplos de Validação com Zod\n');

// Exemplo 1: Dados válidos
console.log('✅ Exemplo 1: Dados válidos');
const validProject = {
    title: "Projeto de Pesquisa de Mercado",
    description: "Pesquisa sobre preferências de consumidores em 2025",
    project_type_id: 1,
    language_id: 1,
    category_id: 1,
    sample_source_id: 1,
    community_id: 1,
    status: true,
    sample_size: 1000,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    company_id: 1
};

// Exemplo 2: Dados inválidos (campo faltando)
console.log('\n❌ Exemplo 2: Campo obrigatório faltando');
const invalidProject = {
    description: "Descrição sem título",
    project_type_id: 1,
    language_id: 1,
    category_id: 1,
    sample_source_id: 1,
    community_id: 1,
    status: false,
    sample_size: 500,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    company_id: 1
    // title está faltando
};

// Exemplo 3: Tipo de dado inválido
console.log('\n❌ Exemplo 3: Tipo de dado inválido');
const wrongTypeProject = {
    title: "Projeto Teste",
    description: "Descrição do projeto",
    project_type_id: "um", // Deveria ser number
    language_id: 1,
    category_id: 1,
    sample_source_id: 1,
    community_id: 1,
    status: "ativo", // Deveria ser boolean
    sample_size: 500,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    company_id: 1
};

// Exemplo 4: Validação de datas
console.log('\n❌ Exemplo 4: Data de fim anterior à data de início');
const invalidDateProject = {
    title: "Projeto Teste",
    description: "Descrição do projeto",
    project_type_id: 1,
    language_id: 1,
    category_id: 1,
    sample_source_id: 1,
    community_id: 1,
    status: false,
    sample_size: 500,
    start_date: "2025-12-31",
    end_date: "2025-01-01", // Data de fim anterior
    company_id: 1
};

// Exemplo 5: Validação de ranges
console.log('\n❌ Exemplo 5: Sample size fora do range');
const invalidRangeProject = {
    title: "Projeto Teste",
    description: "Descrição do projeto",
    project_type_id: 1,
    language_id: 1,
    category_id: 1,
    sample_source_id: 1,
    community_id: 1,
    status: false,
    sample_size: 0, // Deveria ser >= 1
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    company_id: 1
};

// Função para testar a API
async function testAPI(data, description) {
    console.log(`\n🔍 Testando: ${description}`);

    try {
        const response = await fetch('http://localhost:3000/api/v2/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log(`Status: ${response.status}`);

        if (response.ok) {
            console.log('✅ Sucesso:', result.title);
        } else {
            console.log('❌ Erro:', result.error);
            if (result.details) {
                console.log('📋 Detalhes dos erros:');
                result.details.forEach(error => {
                    console.log(`   - ${error.field}: ${error.message}`);
                });
            }
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error.message);
    }
}

// Executar os testes
async function runTests() {
    console.log('🚀 Iniciando testes de validação...\n');

    // Aguardar um pouco para garantir que o servidor está pronto
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Teste 1: Dados válidos
    await testAPI(validProject, 'Dados válidos');

    // Teste 2: Campo faltando
    await testAPI(invalidProject, 'Campo obrigatório faltando (title)');

    // Teste 3: Tipo inválido
    await testAPI(wrongTypeProject, 'Tipos de dados inválidos');

    // Teste 4: Datas inválidas
    await testAPI(invalidDateProject, 'Data de fim anterior à data de início');

    // Teste 5: Range inválido
    await testAPI(invalidRangeProject, 'Sample size fora do range válido');

    console.log('\n✨ Testes concluídos!');
}

// Executar se este arquivo for executado diretamente
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    validProject,
    invalidProject,
    wrongTypeProject,
    invalidDateProject,
    invalidRangeProject,
    testAPI
}; 