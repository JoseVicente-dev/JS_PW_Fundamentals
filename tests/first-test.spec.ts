import { test, expect } from '@playwright/test';

/**
 * This is a test suite
 */
test.describe('This the name of a test suite',()=>{
    
    /**
     * This is a single test
     */
    test('This is the name of the 1st test',({page})=>{
        page.goto
    }
    )
    
    test('This is the name of the 2nd test',()=>{
    
    }
    )
    
    test('This is the name of the 3rd test',()=>{
    
    }
    )

})

/**
 * This is another test suite
 */
test.describe('This the name of another test suite',()=>{
    
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