-- Add new fields to loan_products table
alter table public.loan_products 
add column if not exists loan_type text,
add column if not exists tenure_min_months integer,
add column if not exists tenure_max_months integer,
add column if not exists summary text;

-- Update existing products with loan_type based on product_name
update public.loan_products 
set loan_type = case
  when product_name ilike '%personal%' then 'Personal'
  when product_name ilike '%home%' or product_name ilike '%equity%' then 'Home'
  when product_name ilike '%auto%' or product_name ilike '%car%' then 'Vehicle'
  when product_name ilike '%student%' or product_name ilike '%education%' then 'Education'
  when product_name ilike '%business%' then 'Business'
  else 'Personal'
end
where loan_type is null;

-- Add default tenure values (12-60 months for most loans)
update public.loan_products 
set tenure_min_months = 12,
    tenure_max_months = 60
where tenure_min_months is null or tenure_max_months is null;

-- Add summary based on description if summary is null
update public.loan_products 
set summary = description
where summary is null and description is not null;

