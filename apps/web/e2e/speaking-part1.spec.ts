import { test, expect } from '@playwright/test'

test.describe('IELTS Part 1 Speaking Simulator', () => {
  test('full flow: start → receive question → send reply → receive follow-up', async ({ page }) => {
    await page.goto('/speaking')

    // 1. "Start" button is visible before session begins
    const startBtn = page.getByTestId('start-btn')
    await expect(startBtn).toBeVisible()

    // 2. Click Start — triggers the first AI question
    await startBtn.click()

    // 3. Wait for the first examiner message to stream in
    const firstMessage = page.getByTestId('ai-message').first()
    await expect(firstMessage).not.toBeEmpty()

    // 4. Type a user reply and submit
    const input = page.getByTestId('user-input')
    await expect(input).toBeVisible()
    await input.fill('I work as a software engineer and I enjoy solving complex problems.')
    await page.getByTestId('send-btn').click()

    // 5. A second examiner message appears (follow-up question)
    await expect(page.getByTestId('ai-message')).toHaveCount(2)
    await expect(page.getByTestId('ai-message').nth(1)).not.toBeEmpty()
  })
})
