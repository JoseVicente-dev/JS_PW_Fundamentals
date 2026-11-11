import { test } from '@playwright/test';

/**
 * This is a test suite. We use the method 'describe()'
 */
test.describe('This is the name of a test suite',()=>{
    
    /**
     * This is a single test
     * The callback function receives a Playwright 'Fixture'. In this case, it's {page}
     * 💡 Golden Rule in Playwright: Almost every Playwright method (page.goto, click, fill, expect) returns a Promise. You must always make your test function async and prepend actions with await.
     * Promise: can be resolved or be rejected:
     * - Resolved: the Promise was executed successfully
     * - Rejected: the Promise tried to be resolved but was not able to do it within an interval
     * 
     */
    test('This is the name of the 1st test', async({page})=>{
       await page.goto("https://playground.bondaracademy.com")
       await page.getByText('Forms').click()
       await page.getByText('Form Layouts').click()
    }
    )
    
    test('This is the name of the 2nd test',async ({page})=>{
       await page.goto("https://playground.bondaracademy.com")
       await page.getByText('Forms').click()
       await page.getByText('Form Layouts').click()
    }   
    )
    
    test('This is the name of the 3rd test',()=>{
    
    }
    )

})

/**
 * This is another test suite
 */
test.describe('This is the name of another test suite',()=>{
    
    /**
     * This is a single test
     */
    test('This is the name of the 1st test',()=>{
        
    }
    )
    
    test('This is the name of the 2nd test',()=>{
    
    }
    )
    
    test('This is the name of the 3rd test',()=>{
    
    }
    )

})