import {expect, test} from '@playwright/test';

//General assertions
test('assertions',async({page})=>{
    const basicFormBt = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const value = 5
    expect(value).toEqual(5);


    await expect(basicFormBt.textContent()).toEqual("Submit");
    await expect(basicFormBt).toHaveText('Submit');
})


