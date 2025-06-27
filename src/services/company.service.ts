export class CompanyService {
    async findAll() {
        return [
            { id: 1, name: 'Empresa A' },
            { id: 2, name: 'Empresa B' },
        ];
    }
}