import { test } from '@playwright/test';
/**
 * In order to avoid repeating steps, we can use Hooks
 * The methods include
 *  - beforeAll()
 *  - beforeEach()
 *  - afterEach()
 *  - afterAll()
*/

test.skip

test.beforeEach('Hooks steps before each test', async({page}) => {
    await page.goto("https://playground.bondaracademy.com")
    await page.getByText('Forms').click()
}
)

test('This is the name of the 1st test', async({page})=>{
       await page.getByText('Form Layouts').click()
    }
)

test('This is the name of the 2nd test',async ({page})=>{
       await page.getByText('Datepicker').click()
    }   
)