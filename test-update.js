const testUpdateData = {
    title: "Projeto Atualizado via API",
    description: "Descrição atualizada do projeto",
    project_type_id: 2,
    language_id: 1,
    category_id: 2,
    sample_source_id: 2,
    community_id: 2,
    status: false,
    sample_size: 750,
    start_date: "2025-02-01",
    end_date: "2025-11-30",
    company_id: 2
};

console.log('🔄 Testando atualização do projeto ID 1...');
console.log('📤 Dados enviados:', JSON.stringify(testUpdateData, null, 2));

fetch('http://localhost:3000/api/v2/projects/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(testUpdateData)
})
    .then(response => {
        console.log('Status:', response.status);
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('❌ Erro:', data);
        } else {
            console.log('✅ Projeto atualizado com sucesso:');
            console.log('ID:', data.id);
            console.log('Título:', data.title);
            console.log('Descrição:', data.description);
            console.log('Status:', data.status);
            console.log('Sample Size:', data.sample_size);
            console.log('Empresa:', data.company?.name);
            console.log('Atualizado em:', data.updated_at);
        }
    })
    .catch(error => {
        console.error('❌ Erro na requisição:', error);
    }); 