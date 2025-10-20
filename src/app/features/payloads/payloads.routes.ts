const payloadsComponent = () => import('./payloads.component').then(m => m.PayloadsComponent);
const newPayloadComponent = () => import('./upload-payload/upload-payload.component').then(m => m.UploadPayloadComponent);

export default [
    {
        path: ':projectId/:companyId',
        loadComponent: payloadsComponent,
    },
    {
        path: ':projectId',
        loadComponent: payloadsComponent,
    },
    {
        path: ':projectId/:companyId/upload',
        loadComponent: newPayloadComponent,
        data: { 
            isAutomated: true,
        },
    },
    {
        path: ':projectId/:companyId/manual',
        loadComponent: newPayloadComponent,
    },
    {
        path: ':projectId/:companyId/edit/:id',
        loadComponent: newPayloadComponent,
    }
];