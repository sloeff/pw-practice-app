import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }) => {
    const emailInput = page
      .locator("nb-card", { hasText: "Using the Gird" })
      .getByRole("textbox", { name: "Email" });

    await emailInput.fill("test@test.com");
    await emailInput.clear();
    await emailInput.pressSequentially("test2@test2.com", { delay: 100 });

    const inputValue = await emailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");
  });
});

test("tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();
  const tooltipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await tooltipCard.getByRole("button", { name: "Top" }).hover();

  page.getByRole("tooltip");
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("web tabbles", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // get the row by any text in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();

  const ageInput = page.locator("input-editor").getByPlaceholder("Age");
  await ageInput.clear();
  await ageInput.fill("35");
  await page.locator(".nb-checkmark").click();

  // get the row based the value on the specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();

  //test filter of the table
  const ages = ["20", "30", "40", "200"];

  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);
    const ageRows = page.locator("tbody tr");

    for (let row of await ageRows.all()) {
      const celValue = await row.locator("td").last().textContent();
      if (age == "200") {
        expect(await page.getByRole("table").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(celValue).toEqual(age);
      }
    }
  }
});

test("datepicker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calenderInputField = page.getByPlaceholder("Form Picker");
  await calenderInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 7);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calenderMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
  while(!calenderMonthAndYear.includes(expectedMonthAndYear)){
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    calenderMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
  }

  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click();
  await expect(calenderInputField).toHaveValue(dateToAssert);
});
