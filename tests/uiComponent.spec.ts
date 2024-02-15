import {expect, test} from '@playwright/test';

test.beforeEach(async({page})=>{
    await page.goto('http://localhost:4200/')
})

test.describe('Form layouts page',() =>{
    test.beforeEach(async({page}) =>{
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('input fields', async({page})=>{
        const emailInput = page.locator('nb-card',{hasText:"Using the Gird"}).getByRole('textbox',{name: "Email"});

        await emailInput.fill('test@test.com');
        await emailInput.clear();
        await emailInput.pressSequentially('test2@test2.com',{delay:100});

        const inputValue = await emailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com')
    })
})