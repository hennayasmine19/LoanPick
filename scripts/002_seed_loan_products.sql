-- Insert sample loan products
insert into public.loan_products (bank_name, product_name, description, apr, min_apr, max_apr, loan_amount_min, loan_amount_max, min_credit_score, min_income, features, processing_time) values
('First National Bank', 'Quick Personal Loan', 'Fast approval personal loan with flexible terms', 7.99, 6.99, 10.99, 1000, 50000, 660, 25000, '{"Fast approval","Flexible repayment","No hidden fees"}', '1-2 days'),
('Capital One', 'Flexible Loan Plus', 'Adjustable rate loan with rate adjustment options', 8.49, 7.49, 11.49, 2000, 100000, 680, 30000, '{"Rate adjustment options","Automatic payments","Early payoff benefits"}', '2-3 days'),
('Chase Bank', 'Premium Home Equity', 'Home equity line of credit for established homeowners', 6.99, 5.99, 8.99, 10000, 500000, 700, 50000, '{"Home equity","Lower rates","Large loan amounts"}', '3-5 days'),
('Wells Fargo', 'Secured Personal Loan', 'Secured loan with collateral for better rates', 5.99, 4.99, 7.99, 5000, 75000, 640, 20000, '{"Secured options","Competitive rates","Quick funding"}', '1-2 days'),
('Bank of America', 'Elite Loan Program', 'Premium loan program for high-credit borrowers', 4.99, 3.99, 6.99, 15000, 250000, 750, 75000, '{"Lowest rates","Premium support","Extended terms"}', '2-3 days'),
('Citi Bank', 'Student Loan Refinance', 'Refinance existing student loans at lower rates', 3.99, 2.99, 5.99, 5000, 200000, 670, 35000, '{"Student focus","Income-based repayment","Federal loan consolidation"}', '3-5 days'),
('US Bank', 'Small Business Loan', 'Flexible loans for small business needs', 6.49, 5.49, 8.49, 10000, 150000, 660, 40000, '{"Business-focused","Flexible terms","Higher limits"}', '2-4 days'),
('KeyBank', 'Auto Refinance Plus', 'Refinance your auto loan at better rates', 5.49, 4.49, 7.49, 5000, 75000, 650, 25000, '{"Auto-specific","Quick funding","Refinance options"}', '1-2 days');
