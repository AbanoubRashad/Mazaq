import { expect, test } from '@playwright/test';

test.describe('order ahead smoke test', () => {
  test('home → menu → customize → checkout → confirmation', async ({ page, isMobile }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1, name: 'Saffron, honey & dates are back.' })).toBeVisible();

    // Home → menu (iced coffee category card)
    await page.getByRole('link', { name: /Iced coffee/ }).first().click();
    await expect(page).toHaveURL(/\/en\/menu\/iced-coffee/);
    await expect(page.getByRole('heading', { level: 1, name: 'Iced coffee' })).toBeVisible();

    // Open the customize drawer — URL-addressable
    await page.getByRole('link', { name: 'Customize Iced Spanish Latte' }).click();
    await expect(page).toHaveURL(/item=iced-spanish-latte/);
    const drawer = page.getByRole('dialog', { name: 'Iced Spanish Latte' });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText('EGP 145', { exact: true })).toBeVisible();

    // Oat milk (+15) → EGP 160, as in the design
    await drawer.getByRole('button', { name: /^Oat/ }).click();
    await expect(drawer.getByText('EGP 160', { exact: true })).toBeVisible();
    await drawer.getByRole('button', { name: 'Add to order' }).click();
    await expect(drawer.getByRole('button', { name: 'Added to your order' })).toBeVisible();
    await drawer.getByRole('button', { name: 'Close' }).click();
    await expect(page).not.toHaveURL(/item=/);

    // Quick-add a breakfast item
    await page.goto('/en/menu/healthy-breakfast');
    await page.getByRole('button', { name: 'Add Avocado & Egg Sourdough' }).click();

    // Checkout
    if (isMobile) {
      await page.getByRole('link', { name: /View basket/ }).click();
    } else {
      await page.getByRole('link', { name: /Basket, 2 items/ }).click();
    }
    await expect(page).toHaveURL(/\/en\/checkout/);
    await expect(page.getByTestId('total')).toHaveText('EGP 345');
    await expect(page.getByTestId('vat')).toHaveText('EGP 42.37');
    await expect(page.getByText('+34')).toBeVisible();
    // 112 beans < 150 → pay with beans disabled
    await expect(page.getByRole('switch')).toBeDisabled();

    await page.getByRole('button', { name: /Place order/ }).click();
    await expect(page.getByRole('heading', { name: 'Order placed.' })).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(/MZ-\d{4}/);
    await expect(page.getByTestId('pickup-code')).toHaveText(/^[A-Z0-9]{3}$/);
  });

  test('Arabic is right-to-left with Arabic-Indic prices', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('الزعفران والعسل والتمر رجعوا.');
    await expect(page.getByText(/١٥٥/).first()).toBeVisible();
  });

  test('market selector switches currency', async ({ page, isMobile }) => {
    test.skip(isMobile, 'utility bar is desktop-only');
    await page.goto('/en/menu/hot-coffee');
    await page.getByLabel('Market').first().selectOption('AE');
    await expect(page.getByText(/AED \d+/).first()).toBeVisible();
    await page.reload();
    await expect(page.getByText(/AED \d+/).first()).toBeVisible();
  });
});
