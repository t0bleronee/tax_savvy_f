CREATE DATABASE IF NOT EXISTS TaxSavvy;
-- drop database if exists TaxSavvy;
USE TaxSavvy;
-- ================================================
-- Drop Existing Tables (if any)
-- ================================================
DROP TABLE IF EXISTS FeatureProfessions;
DROP TABLE IF EXISTS FeatureAgeGroups;
DROP TABLE IF EXISTS FeatureLocations;
DROP TABLE IF EXISTS Features;

-- ================================================
-- Create the Features Table with JSON column
-- ================================================
CREATE TABLE Features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,  -- Prevent duplicate features
    description TEXT NOT NULL,                   
    detailed_explanation JSON NOT NULL,          
    category VARCHAR(100) NOT NULL
);

-- ✅ Index for faster filtering by category
CREATE INDEX idx_category ON Features(category);

-- ================================================
-- Create the FeatureProfessions Table (Join Table)
-- ================================================
CREATE TABLE FeatureProfessions (
    feature_id INT NOT NULL,
    profession VARCHAR(255) NOT NULL,
    PRIMARY KEY (feature_id, profession),  
    FOREIGN KEY (feature_id) REFERENCES Features(id) ON DELETE CASCADE
);

CREATE INDEX idx_profession ON FeatureProfessions(profession);

-- ================================================
-- Create Age Groups Association Table
-- ================================================
CREATE TABLE FeatureAgeGroups (
    feature_id INT NOT NULL,
    age_group VARCHAR(100) NOT NULL,  
    PRIMARY KEY (feature_id, age_group),
    FOREIGN KEY (feature_id) REFERENCES Features(id) ON DELETE CASCADE
);

CREATE INDEX idx_age_group ON FeatureAgeGroups(age_group);

-- ================================================
-- Create Locations Association Table
-- ================================================
CREATE TABLE FeatureLocations (
    feature_id INT NOT NULL,
    location VARCHAR(255) NOT NULL,  
    PRIMARY KEY (feature_id, location),
    FOREIGN KEY (feature_id) REFERENCES Features(id) ON DELETE CASCADE
);

CREATE INDEX idx_location ON FeatureLocations(location);

-- ================================================
-- Create the Stored Procedure for Bulk Insertion
-- ================================================
DELIMITER $$

CREATE PROCEDURE AddFeatureWithTags(
    IN feature_name VARCHAR(255),
    IN feature_description TEXT,
    IN feature_detailed_explanation TEXT,
    IN feature_category VARCHAR(100),
    IN profession_tags TEXT,  -- Comma-separated professions
    IN age_group_tags TEXT,   -- Comma-separated age groups
    IN location_tags TEXT     -- Comma-separated locations
)
BEGIN
    DECLARE feature_id INT;
    DECLARE tag VARCHAR(255);
    DECLARE comma_pos INT;

    -- ✅ Insert into Features table
    INSERT INTO Features (name, description, detailed_explanation, category)
    VALUES (feature_name, feature_description, feature_detailed_explanation, feature_category);
    
    -- ✅ Get last inserted feature ID
    SET feature_id = LAST_INSERT_ID();
    
    -- ✅ Insert Professions
    WHILE profession_tags <> '' DO
        SET comma_pos = LOCATE(',', profession_tags);
        IF comma_pos = 0 THEN
            SET tag = TRIM(profession_tags);
            SET profession_tags = '';
        ELSE
            SET tag = TRIM(SUBSTRING_INDEX(profession_tags, ',', 1));
            SET profession_tags = TRIM(SUBSTRING(profession_tags, comma_pos + 1));
        END IF;

        IF tag <> '' THEN
            INSERT IGNORE INTO FeatureProfessions (feature_id, profession) VALUES (feature_id, tag);
        END IF;
    END WHILE;

    -- ✅ Insert Age Groups
    WHILE age_group_tags <> '' DO
        SET comma_pos = LOCATE(',', age_group_tags);
        IF comma_pos = 0 THEN
            SET tag = TRIM(age_group_tags);
            SET age_group_tags = '';
        ELSE
            SET tag = TRIM(SUBSTRING_INDEX(age_group_tags, ',', 1));
            SET age_group_tags = TRIM(SUBSTRING(age_group_tags, comma_pos + 1));
        END IF;

        IF tag <> '' THEN
            INSERT IGNORE INTO FeatureAgeGroups (feature_id, age_group) VALUES (feature_id, tag);
        END IF;
    END WHILE;

    -- ✅ Insert Locations
    WHILE location_tags <> '' DO
        SET comma_pos = LOCATE(',', location_tags);
        IF comma_pos = 0 THEN
            SET tag = TRIM(location_tags);
            SET location_tags = '';
        ELSE
            SET tag = TRIM(SUBSTRING_INDEX(location_tags, ',', 1));
            SET location_tags = TRIM(SUBSTRING(location_tags, comma_pos + 1));
        END IF;

        IF tag <> '' THEN
            INSERT IGNORE INTO FeatureLocations (feature_id, location) VALUES (feature_id, tag);
        END IF;
    END WHILE;

END $$

DELIMITER ;

-- ================================================
-- Insert a Sample Feature using the Stored Procedure
-- ================================================
CALL AddFeatureWithTags(
  'Zero-Poverty',
  'Comprehensive measures to eradicate poverty through social welfare, employment, and financial inclusion programs.',
  '{"explanation": "- Implement large-scale employment generation programs\\n- Expand social security and direct benefit transfers\\n- Strengthen financial inclusion and microfinance initiatives", 
    "affects": "- Low-income households receive financial aid and job opportunities\\n- Entrepreneurs and MSMEs benefit from microfinance support\\n- Social welfare schemes improve standard of living"}',
  'Economy',
  'Low-Income Individuals, Daily Wage Workers',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Hundred Per Cent Good Quality School Education',
  'Ensuring universal access to high-quality education through curriculum reform, teacher training, and infrastructure development.',
  '{"explanation": "- Upgrade school infrastructure and digital learning facilities\\n- Implement teacher training programs for quality education\\n- Introduce skill-based learning and holistic curriculum", 
    "affects": "- Students receive improved education quality\\n- Teachers benefit from professional development programs\\n- Parents see better academic outcomes for children"}',
  'Education',
  'Students, Teachers',
  '0-18',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Access to High-Quality, Affordable, and Comprehensive Healthcare',
  'Initiatives to enhance healthcare accessibility and affordability, including the establishment of Day Care Cancer Centres and exemption of customs duty on life-saving cancer drugs.',
  '{"explanation": "- Establish Day Care Cancer Centres in all district hospitals over the next three years\\n- Exempt 36 life-saving cancer drugs from customs duty", 
    "affects": "- Improved access to quality cancer care in underserved regions\\n- Reduced financial burden on patients requiring life-saving medications"}',
  'Healthcare',
  'General Public',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Hundred Per Cent Skilled Labour with Meaningful Employment',
  'Initiatives to achieve full skilled employment through intensive skill-development programs and employment generation across various sectors.',
  '{"explanation": "- Organize intensive skill-development programs for youth\\n- Create employment opportunities in sectors like tourism, manufacturing, and fisheries\\n- Support entrepreneurship and skilling initiatives", 
    "affects": "- Youth gain relevant skills for employment\\n- Increased job opportunities in diverse sectors\\n- Economic growth through a skilled workforce"}',
  'Economy',
  'General Public',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Seventy Per Cent Women in Economic Activities',
  'Initiatives to increase women\'s participation in the workforce from the current 40.3% to 70%, including enhanced gender-focused budget allocations and support for women entrepreneurs.',
  '{"explanation": "- Increase Gender Budget allocation to 8.86% of the total budget\\n- Provide term loans up to INR 2 crore for first-time women entrepreneurs over the next five years\\n- Support skill development and employment opportunities for women", 
    "affects": "- Women gain increased access to financial resources and entrepreneurial support\\n- Enhanced skill development programs lead to higher employability of women\\n- Overall economic growth through increased female labor force participation"}',
  'Women Empowerment, Economy',
  'Female Workforce',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Farmers Making Our Country the "Food Basket of the World"',
  'Initiatives to enhance agricultural productivity and export potential, positioning India as a leading global food supplier.',
  '{"explanation": "- Increase budget allocation for agriculture by over 15% to $20 billion\\n- Develop high-yielding seed varieties and improve storage infrastructure\\n- Aim to boost farm exports to $80 billion by 2030", 
    "affects": "- Farmers benefit from improved resources and market access\\n- Strengthened agricultural supply chains\\n- Enhanced global competitiveness of Indian agriculture"}',
  'Agriculture, Economy',
  'Farmers, Agribusiness Entrepreneurs, Exporters',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Union Budget 2025-2026 Financial Estimates',
  'The total receipts, excluding borrowings, are estimated at ₹34.96 lakh crore, while the total expenditure is projected at ₹50.65 lakh crore for the fiscal year 2025-2026.',
  '{"explanation": "- Total receipts (excluding borrowings): ₹34.96 lakh crore\\n- Total expenditure: ₹50.65 lakh crore", "affects": "- Reflects the government\'s fiscal policy and budgetary allocations for various sectors"}',
  'Economy',
  'Economists, General Public',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Union Budget 2025-2026 Net Tax Receipts',
  'The net tax receipts for the fiscal year 2025-2026 are estimated at ₹28.37 lakh crore.',
  '{"explanation": "- Net tax receipts: ₹28.37 lakh crore", "affects": "- Indicates the government\'s revenue from taxes after transfers to states"}',
  'Economy',
  'Economists, General Public',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Union Budget 2025-2026 Fiscal Deficit Estimate',
  'The fiscal deficit for the fiscal year 2025-2026 is estimated to be 4.4% of GDP.',
  '{"explanation": "- The fiscal deficit represents the gap between the government\'s total expenditure and its total revenue (excluding borrowings).\\n- A fiscal deficit of 4.4% means the government is spending more than it earns, and the shortfall is covered through borrowings.\\n- A lower fiscal deficit is generally better as it reduces the need for excessive borrowing and interest payments in the future.", 
    "affects": "- A high fiscal deficit can lead to inflation, affecting the cost of living for citizens.\\n- It influences interest rates, which can affect home loans, business investments, and economic growth.\\n- A responsible fiscal deficit ensures that the government can continue funding essential services like healthcare, education, and infrastructure without excessive debt."}',
  'Economy',
  'General Public',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Union Budget 2025-2026 Gross Market Borrowings',
  'The government plans to borrow ₹14.82 lakh crore from the market in the fiscal year 2025-2026 to finance its expenditure.',
  '{"explanation": "- Gross market borrowings refer to the total amount the government intends to raise from the public and institutions by issuing bonds and securities.\\n- This borrowing helps bridge the gap between the government\'s expenditure and its revenues, ensuring the continuation of public services and development projects.\\n- Managing these borrowings is crucial to maintain economic stability and control inflation.", "affects": "- Investors and financial institutions have opportunities to invest in government securities.\\n- Proper management of borrowings can lead to stable interest rates, affecting loans and savings for the general public.\\n- Ensures funding for infrastructure projects, social programs, and other public services that benefit citizens nationwide."}',
  'Economy',
  'General Public',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Union Budget 2025-2026 Capital Expenditure Allocation',
  'The government has allocated ₹11.21 lakh crore for capital expenditure in the fiscal year 2025-2026, constituting 3.1% of the GDP.',
  '{"explanation": "- Capital expenditure refers to funds used by the government to build or upgrade physical assets like roads, bridges, and schools.\\n- An allocation of ₹11.21 lakh crore means the government is investing this amount in infrastructure and development projects.\\n- This investment aims to boost economic growth, create jobs, and improve public services.", "affects": "- Citizens may experience better infrastructure, leading to improved quality of life.\\n- Job opportunities may increase due to new projects and developments.\\n- Businesses could benefit from enhanced logistics and facilities, promoting economic activity."}',
  'Infrastructure & Development',
  'General Public',
  'All age groups',
  'Nationwide'
);
CALL AddFeatureWithTags(
  'Prime Minister Dhan-Dhaanya Krishi Yojana - Developing Agri Districts Programme',
  'A new initiative targeting 100 districts with low agricultural productivity to enhance farming practices and support 1.7 crore farmers.',
  '{"explanation": "- The programme aims to improve agricultural productivity in 100 identified districts.\\n- It focuses on adopting crop diversification and sustainable farming practices.\\n- Enhances post-harvest storage at the panchayat and block levels.\\n- Improves irrigation facilities and provides access to both long-term and short-term credit for farmers.", "affects": "- Farmers in the selected districts will receive better resources and support.\\n- Increased crop yields and diversified farming can lead to higher incomes.\\n- Improved storage and irrigation facilities will reduce post-harvest losses and enhance crop quality."}',
  'Agriculture',
  'Farmers, Rural Communities',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Building Rural Prosperity and Resilience',
  'A comprehensive initiative aimed at enhancing agricultural productivity, promoting sustainable farming practices, and improving rural infrastructure to boost the rural economy and livelihoods.',
  '{"explanation": "- The initiative focuses on: \\n  1. Enhancing agricultural productivity through modern techniques and high-yield seeds. \\n  2. Promoting crop diversification and sustainable agriculture to ensure environmental balance. \\n  3. Improving post-harvest infrastructure, including storage and processing facilities, to reduce waste and increase farmers\' income. \\n  4. Strengthening rural infrastructure such as roads, electricity, and irrigation to support agricultural and non-agricultural activities. \\n- These measures aim to create a resilient rural economy, reduce poverty, and improve the quality of life in rural areas.", "affects": "- Farmers will benefit from increased productivity and income. \\n- Rural communities will experience improved infrastructure and services. \\n- The overall economy may see growth due to enhanced rural demand and reduced urban-rural disparities."}',
  'Agriculture',
  'Farmers, Rural Communities',
  'All age groups',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Mission for Aatmanirbharta in Pulses',
  'A six-year mission aimed at achieving self-reliance in pulses production, focusing on key varieties such as Tur, Urad, and Masoor.',
  '{"explanation": "- The mission seeks to reduce dependence on imports by boosting domestic production of pulses.\\n- Central agencies like NAFED and NCCF will procure these pulses from farmers over the next four years, ensuring stable market support.\\n- Emphasis will be placed on developing and making available climate-resilient seed varieties, enhancing protein content, increasing productivity, and improving post-harvest storage and management.", "affects": "- Farmers will benefit from assured procurement and remunerative prices, leading to increased income stability.\\n- Consumers can expect a more stable supply of pulses, potentially leading to price stability in the market.\\n- The nation moves towards self-sufficiency in essential food items, reducing reliance on imports."}',
  'Agriculture',
  'Farmers, General Public',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Comprehensive Programme for Vegetables & Fruits',
  'A nationwide initiative to enhance the production, supply chain efficiency, processing capabilities, and ensure fair prices for farmers engaged in cultivating vegetables and fruits.',
  '{"explanation": "- The programme aims to: \\n  1. Increase the production of vegetables and fruits to meet the rising domestic demand. \\n  2. Improve supply chain efficiency to reduce post-harvest losses and ensure timely delivery to markets. \\n  3. Enhance processing facilities to add value to produce and extend shelf life. \\n  4. Ensure farmers receive remunerative prices for their produce, boosting their income and livelihood. \\n- Implementation will be in partnership with state governments, involving Farmer Producer Organizations (FPOs) and cooperatives to ensure grassroots-level impact.", "affects": "- Farmers: Access to better infrastructure, training, and market opportunities, leading to increased income. \\n- Consumers: Availability of a wider variety of fresh and processed vegetables and fruits at stable prices. \\n- Agribusinesses: Opportunities for investment in processing units, cold storage, and logistics. \\n- Economy: Strengthening of the agricultural sector, leading to rural development and employment generation."}',
  'Agriculture',
  'Farmers, Agribusiness Entrepreneurs',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Makhana Board in Bihar',
  'Establishment of a dedicated board to enhance the production, processing, value addition, and marketing of makhana in Bihar.',
  '{"explanation": "- Makhana, also known as fox nut, is a traditional aquatic crop predominantly cultivated in Bihar.\\n- The government proposes to set up a Makhana Board in Bihar to: \\n  1. Improve production techniques and increase yield. \\n  2. Enhance processing methods to ensure better quality and shelf-life. \\n  3. Add value through product diversification and innovation. \\n  4. Strengthen marketing strategies to expand reach both domestically and internationally.\\n- The board will organize farmers into Farmer Producer Organizations (FPOs) to: \\n  1. Provide training and handholding support. \\n  2. Ensure farmers benefit from relevant government schemes.\\n- This initiative aims to boost the income of makhana farmers and promote the crop as a significant contributor to the states economy.", "affects": "- Makhana farmers in Bihar will receive support to enhance their production and income.\\n- The local economy is expected to benefit from increased makhana-related activities.\\n- Consumers may have access to better quality and a wider variety of makhana products."}',
  'Agriculture',
  'Farmers, Agribusiness Entrepreneurs',
  '18-60',
  'Bihar'
);

CALL AddFeatureWithTags(
  'National Mission on High Yielding Seeds',
  'A mission aimed at strengthening the research ecosystem and promoting the development and distribution of high-yielding, pest-resistant, and climate-resilient seed varieties.',
  '{"explanation": "- The mission focuses on: \\n  1. Enhancing research facilities to develop superior seed varieties. \\n  2. Targeted development of seeds that offer high yields, resist pests, and withstand climate variations. \\n  3. Ensuring that over 100 newly developed seed varieties, released since July 2024, are commercially available to farmers.\\n- This initiative aims to boost agricultural productivity, reduce crop losses, and support farmers in adapting to changing environmental conditions.", "affects": "- Farmers will have access to better seed varieties, leading to increased crop yields and income. \\n- The agricultural sector will benefit from improved resilience against pests and climate challenges. \\n- Consumers may experience more stable food prices due to enhanced crop production."}',
  'Agriculture',
  'Farmers, Agricultural Scientists',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Fisheries Development Initiative',
  'A comprehensive program aimed at unlocking the untapped potential of India\'s marine sector, enhancing seafood exports, and supporting the livelihoods of those involved in fisheries.',
  '{"explanation": "- India\'s seafood exports are valued at ₹60,000 crore.\\n- To further boost this sector, the government plans to introduce a program focused on: \\n  1. Developing modern infrastructure for fishing harbors and landing centers. \\n  2. Promoting sustainable fishing practices to preserve marine biodiversity. \\n  3. Providing financial assistance and training to fishermen and fish farmers. \\n  4. Encouraging value addition and diversification of seafood products to meet international standards.\\n- This initiative aims to increase the income of those involved in the fisheries sector and position India as a leading exporter of seafood products.", "affects": "- Fishermen and fish farmers will benefit from improved infrastructure, access to modern technology, and financial support, leading to increased productivity and income.\\n- The seafood processing industry will have access to a more consistent and high-quality supply of raw materials, enabling them to expand their operations.\\n- Consumers may enjoy a greater variety of seafood products at stable prices.\\n- The nation\'s economy will benefit from increased export earnings and job creation in the fisheries sector."}',
  'Fisheries',
  'Fishermen',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Mission for Cotton Productivity',
  'A 5-year mission to enhance cotton productivity and sustainability, focusing on promoting extra-long staple cotton varieties and strengthening the textile value chain.',
  '{"explanation": "- A long-term initiative to boost cotton yield and improve sustainability.\\n- Focus on extra-long staple cotton to enhance quality.\\n- Support through scientific advancements and modern farming techniques.\\n- Aligns with the 5F principle: Farm to Fibre to Factory to Fashion to Foreign.", "affects": "- Farmers gain access to better seeds and improved cultivation techniques.\\n- Textile manufacturers benefit from higher-quality cotton.\\n- Exporters and the economy gain from a strengthened textile sector."}',
  'Agriculture',
  'Farmers, Textile Manufacturers, Exporters',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Enhanced Credit through Kisan Credit Card (KCC)',
  'The government has increased the loan limit under the Modified Interest Subvention Scheme from ₹3 lakh to ₹5 lakh for loans taken through the KCC, benefiting farmers, fishermen, and dairy farmers.',
  '{"explanation": "- The Kisan Credit Card (KCC) scheme provides short-term credit to farmers, fishermen, and dairy farmers.\\n- To support these groups, the government has raised the loan limit under the Modified Interest Subvention Scheme from ₹3 lakh to ₹5 lakh.\\n- This enhancement aims to provide greater financial flexibility and support for agricultural and allied activities.", "affects": "- Farmers, fishermen, and dairy farmers will have access to increased credit, enabling them to invest in inputs, equipment, and other necessities.\\n- This initiative is expected to improve productivity and income levels in the agriculture and allied sectors."}',
  'Agriculture',
  'Farmers, Fishermen, Dairy Farmers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Urea Plant in Assam',
  'Establishment of a urea plant with an annual capacity of 12.7 lakh metric tons at Namrup, Assam, to enhance domestic urea production and achieve self-reliance.',
  '{"explanation": "- The government plans to set up a urea plant in Namrup, Assam, with a production capacity of 12.7 lakh metric tons per year.\\n- This initiative aims to increase domestic urea supply, reducing dependence on imports and promoting self-sufficiency in fertilizer production.\\n- The plant will support local agriculture by ensuring timely and adequate availability of urea for farmers.", "affects": "- Farmers in Assam and neighboring regions will benefit from improved access to urea, leading to enhanced crop yields.\\n- The initiative is expected to boost the local economy through job creation and infrastructure development.\\n- Nationally, increased urea production will contribute to agricultural growth and food security."}',
  'Agriculture',
  'Farmers, Industrial Workers, Agribusiness Entrepreneurs',
  '18-60',
  'Assam'
);

CALL AddFeatureWithTags(
  'Revision in Classification Criteria for MSMEs',
  'Enhancement of investment and turnover limits for MSME classification to 2.5 and 2 times respectively, aiming to boost efficiency, technological advancement, and capital access.',
  '{"explanation": "- The government has revised the criteria for classifying Micro, Small, and Medium Enterprises (MSMEs).\\n- Investment limits have been increased by 2.5 times, and turnover limits have been doubled.\\n- This change aims to help MSMEs scale up operations, adopt new technologies, and access better financing options.", "affects": "- MSMEs will find it easier to expand and innovate due to relaxed classification thresholds.\\n- Enhanced access to credit and government schemes tailored for MSMEs.\\n- Potential for increased employment opportunities and economic growth in the MSME sector."}',
  'Business & Finance',
  'Small Business Owners, Entrepreneurs',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Credit Cards for Micro Enterprises',
  'Introduction of customized Credit Cards with a ₹5 lakh limit for micro enterprises registered on the Udyam portal, aiming to enhance financial accessibility and operational efficiency.',
  '{"explanation": "- The government will introduce customized Credit Cards with a credit limit of ₹5 lakh for micro enterprises registered on the Udyam portal.\\n- In the first year, 10 lakh such cards are planned to be issued.\\n- This initiative aims to provide micro enterprises with easier access to credit, facilitating smoother business operations and financial management.", "affects": "- Micro enterprise owners will benefit from improved access to formal credit, enabling them to manage operational expenses more effectively.\\n- The initiative is expected to reduce reliance on informal lending sources, promoting financial inclusion and business growth."}',
  'Business & Finance',
  'Small Business Owners, Entrepreneurs',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Fund of Funds for Startups (FFS)',
  'The government has established the Fund of Funds for Startups (FFS) with a corpus of ₹10,000 crore to provide financial support to startups through Alternative Investment Funds (AIFs).',
  '{"explanation": "- The Fund of Funds for Startups (FFS) was launched in 2016 with a total corpus of ₹10,000 crore.\\n- Managed by the Small Industries Development Bank of India (SIDBI), FFS invests in SEBI-registered Alternative Investment Funds (AIFs), which in turn provide funding to startups.\\n- This initiative aims to enhance access to domestic capital for startups, fostering innovation and entrepreneurship.", "affects": "- Startups across various sectors receive financial support, enabling them to scale operations and innovate.\\n- The startup ecosystem benefits from increased investment, leading to job creation and economic growth.\\n- Entrepreneurs gain improved access to funding sources, reducing dependency on traditional financing methods."}',
  'Business & Finance',
  'Small Business Owners, Entrepreneurs',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Scheme for First-time Entrepreneurs',
  'A new scheme to provide term loans up to ₹2 crore over the next 5 years to 5 lakh first-time entrepreneurs, including women and individuals from Scheduled Castes and Scheduled Tribes.',
  '{"explanation": "- The government has introduced a scheme targeting first-time entrepreneurs, aiming to foster innovation and business growth.\\n- The scheme offers term loans up to ₹2 crore, facilitating access to capital for new business ventures.\\n- It is inclusive, focusing on women and individuals from Scheduled Castes and Scheduled Tribes, promoting diversity in entrepreneurship.", "affects": "- Aspiring entrepreneurs will have improved access to financial resources, enabling them to start and scale their businesses.\\n- The initiative is expected to stimulate economic development by encouraging the establishment of new enterprises across various sectors."}',
  'Business & Finance',
  'Small Business Owners, Entrepreneurs',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Focus Product Scheme for Footwear & Leather Sectors',
  'A scheme aimed at enhancing productivity, quality, and competitiveness in India\'s footwear and leather sectors by supporting design capacity, component manufacturing, and machinery for both leather and non-leather products.',
  '{"explanation": "- The government has introduced a Focus Product Scheme targeting the footwear and leather industries.\\n- This initiative supports areas such as design capacity, component manufacturing, and the procurement of machinery essential for producing high-quality leather and non-leather footwear.\\n- The scheme aims to boost domestic manufacturing, improve product quality, and enhance the global competitiveness of Indian footwear and leather products.", "affects": "- Entrepreneurs and businesses in the footwear and leather sectors will benefit from increased support for design and manufacturing capabilities.\\n- The initiative is expected to create approximately 2.2 million jobs, providing significant employment opportunities.\\n- With a projected turnover of ₹4 lakh crore and exports exceeding ₹1.1 lakh crore, the scheme will contribute substantially to economic growth and export earnings."}',
  'Manufacturing & Export ',
  'Manufacturers, Exporters',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Measures for the Toy Sector',
  'A scheme aimed at making India a global hub for toy manufacturing by developing clusters, enhancing skills, and creating a robust manufacturing ecosystem for high-quality, innovative, and sustainable toys.',
  '{"explanation": "- Building upon the National Action Plan for Toys, the government has introduced a scheme to transform India into a global hub for toy manufacturing.\\n- The initiative focuses on developing specialized clusters, enhancing skill sets within the industry, and establishing a robust manufacturing ecosystem.\\n- Emphasis is placed on producing high-quality, unique, innovative, and sustainable toys that embody the \'Made in India\' brand.", "affects": "- Entrepreneurs and businesses in the toy manufacturing sector will benefit from increased support and infrastructure development.\\n- The initiative is expected to generate significant employment opportunities within the industry.\\n- Consumers will have access to a diverse range of high-quality and innovative toys, reflecting Indian culture and values."}',
  'Manufacturing & Export',
  'Manufacturers, Exporters',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Support for Food Processing',
  'Establishment of a National Institute of Food Technology, Entrepreneurship, and Management in Bihar to enhance food processing capabilities, promote entrepreneurship, and provide advanced training and research opportunities in the sector.',
  '{"explanation": "- The government has announced the establishment of a National Institute of Food Technology, Entrepreneurship, and Management in Bihar.\\n- This institute aims to bolster the food processing industry by offering advanced training, fostering entrepreneurship, and facilitating research and development.\\n- The initiative seeks to enhance value addition in agriculture, reduce post-harvest losses, and create employment opportunities in the food processing sector.", "affects": "- Entrepreneurs and businesses in the food processing industry will benefit from access to advanced training and research facilities.\\n- The initiative is expected to generate employment opportunities, contributing to economic growth in the region.\\n- Farmers may experience increased demand for their produce, leading to better income and reduced wastage."}',
  'Education, Entrepreneurship, Agriculture',
  'Students, Entrepreneurs, Farmers',
  'All Age Groups',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'Manufacturing Mission - Furthering "Make in India"',
  'A National Manufacturing Mission aimed at providing policy support, execution roadmaps, and a governance framework to enhance the manufacturing sector across small, medium, and large industries, thereby promoting the "Make in India" initiative.',
  '{
    "explanation": "- The government has introduced a National Manufacturing Mission to bolster the initiative.\\n- This mission focuses on offering policy support, detailed execution plans, and a robust governance and monitoring framework.\\n- It aims to enhance the manufacturing capabilities of small, medium, and large industries, fostering a conducive environment for domestic production and reducing reliance on imports.",
    "affects": "- Entrepreneurs and businesses across various manufacturing sectors will benefit from streamlined policies and support mechanisms.\\n- The initiative is expected to generate employment opportunities, contributing to economic growth and development.\\n- Consumers may experience increased availability of domestically produced goods, potentially leading to more competitive pricing and quality."
  }',
  'Manufacturing, Export',
  'Manufacturers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Investing in People',
  'A key pillar of India’s development strategy that focuses on enhancing human capital through quality education, improved healthcare, and robust skill development initiatives.',
  '{
    "explanation": "- This feature reflects the government’s commitment to invest in its citizens by strengthening education, healthcare, and vocational training.\\n- It is designed to empower individuals and build a more productive workforce in line with national development goals.",
    "affects": "- Students, job seekers, and communities benefit through better learning environments, enhanced health services, and improved employment opportunities.\\n- Ultimately, this leads to a stronger and more resilient economy."
  }',
  'Investment, Human Development',
  'General Public, Students, Workforce',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Saksham Anganwadi and Poshan 2.0',
  'An initiative aimed at strengthening Anganwadi centers by integrating them with the Poshan 2.0 framework to improve nutritional outcomes for mothers and young children.',
  '{
    "explanation": "- This feature combines the traditional Anganwadi model with the enhanced framework of Poshan 2.0, focusing on improved service delivery, better monitoring, and resource allocation.\\n- It is part of the government’s effort to combat malnutrition and support early childhood development through improved infrastructure and capacity building for Anganwadi workers.",
    "affects": "- Pregnant women, lactating mothers, and children receive improved nutritional care and early childhood support.\\n- Local communities and Anganwadi workers benefit from enhanced training and resources, ensuring a more effective delivery of services."
  }',
  'Nutrition, Child Development',
  'Women, Children, Community Workers',
  '0-6 (for children), Adult (for mothers)',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Atal Tinkering Labs',
  'A government initiative under the Atal Innovation Mission to set up innovation labs in schools, fostering creativity, scientific thinking, and problem-solving skills among students.',
  '{
    "explanation": "- These labs are established to provide students with hands-on experience in modern technology and innovation.\\n- They are equipped with tools and resources that encourage experimentation, critical thinking, and the development of solutions to real-world challenges.",
    "affects": "- Students gain practical exposure to science and technology, enhancing their learning and creativity.\\n- Educators receive additional resources and training to foster an innovative teaching environment."
  }',
  'Innovation, Education',
  'Students, Educators',
  '6-18',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Broadband Connectivity to Government Secondary Schools and PHCs',
  'An initiative to provide high-speed broadband connectivity to government secondary schools and Primary Health Centres (PHCs) to support digital education and improved healthcare service delivery.',
  '{
    "explanation": "- This feature ensures that schools and health centres are equipped with reliable broadband as part of the Digital India initiative.\\n- Enhanced connectivity supports digital classrooms and telemedicine, leading to better access to information and healthcare services.",
    "affects": "- Students and educators benefit from access to online educational resources and digital learning tools.\\n- Healthcare providers can utilize digital technologies to improve patient care and health management."
  }',
  'Digital, Education, Health',
  'Students, Educators, Healthcare Workers',
  '6-18 (Schools), All (PHCs)',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Bharatiya Bhasha Pustak Scheme',
  'A government initiative to promote literature in Indian languages by supporting the publication and wider dissemination of books in regional languages.',
  '{
    "explanation": "- This scheme is designed to preserve and promote India’s rich linguistic heritage by financially and logistically supporting publishers and authors working in regional languages.\\n- It aims to enhance access to quality literature that reflects India’s diverse cultural traditions.",
    "affects": "- Authors and publishers benefit from targeted support to produce and distribute regional language books.\\n- Readers across the country gain improved access to a wide range of literary works in their native languages."
  }',
  'Culture, Literature',
  'Authors, Publishers, General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'National Centres of Excellence for Skilling',
  'An initiative to establish centers of excellence that provide advanced and industry-relevant skill development training across various sectors, supporting the government’s Skill India mission.',
  '{
    "explanation": "- These centres offer state-of-the-art training programs and certification courses that address the skill gap in emerging and traditional sectors.\\n- They are set up to enhance employability by providing practical and modern training aligned with industry needs.",
    "affects": "- Job seekers and existing workers benefit from high-quality skill development, increasing their employability and career advancement prospects.\\n- Industries receive a more skilled workforce, contributing to economic growth and competitiveness."
  }',
  'Skilling, Employment',
  'Job Seekers, Workers, Industry Professionals',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Expansion of Capacity in IITs',
  'An initiative to expand the capacity of Indian Institutes of Technology (IITs) by increasing seats, enhancing infrastructure, and upgrading research facilities to meet growing demand and maintain global standards in technical education.',
  '{
    "explanation": "- The government plans to boost the capacity of IITs by expanding infrastructure, increasing student intake, and upgrading research facilities. This effort is aimed at maintaining IITs’ competitive edge and addressing the demand for high-quality technical education.\\n- These measures include investments in new laboratories, faculty recruitment, and campus development as outlined in official higher education policy documents.",
    "affects": "- Prospective and current students benefit from more opportunities to access world-class technical education.\\n- Researchers and industry stakeholders may experience enhanced collaboration and innovation due to improved academic facilities."
  }',
  'Education, Technology',
  'Students, Researchers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Centre of Excellence in AI for Education',
  'A government initiative to establish a Centre of Excellence focused on integrating Artificial Intelligence (AI) into the education sector to enhance teaching, learning, and policy-making.',
  '{
    "explanation": "- This centre will explore and deploy AI technologies in education to improve learning outcomes, enable personalized instruction, and streamline educational administration.\\n- Official resources indicate that such initiatives aim to harness emerging technologies to address educational challenges and drive research in AI applications for schooling.",
    "affects": "- Educators and students gain access to innovative teaching tools and digital resources that can personalize learning experiences.\\n- Policymakers can utilize data and insights from AI research to better design education reforms."
  }',
  'Education',
  'Educators, Students',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Expansion of Medical Education',
  'An initiative to broaden the scope of medical education by establishing new institutions, increasing seat availability, and modernizing infrastructure to meet contemporary healthcare needs.',
  '{
    "explanation": "- The government is focused on expanding medical education to create a larger, better-trained pool of healthcare professionals.\\n- This involves setting up new medical colleges, increasing student intake, and upgrading existing facilities to ensure that education meets modern standards, as reflected in official health and education policies.",
    "affects": "- Aspiring medical students benefit from increased opportunities to pursue medical education.\\n- The healthcare system gains from a better-qualified workforce, which can lead to improved healthcare services and outcomes."
  }',
  'Education, Health',
  'Students, Healthcare Workers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Day Care Cancer Centres in all District Hospitals',
  'A government initiative to set up specialized Day Care Cancer Centres in every district hospital, offering accessible and affordable cancer diagnosis, treatment, and palliative care services.',
  '{
    "explanation": "- This initiative aims to decentralize cancer care by establishing dedicated day care centres within district hospitals, thus facilitating early detection and timely treatment of cancer.\\n- Official sources note that such measures are intended to reduce the burden on tertiary care centres while providing quality care at the local level.",
    "affects": "- Cancer patients and their families benefit from reduced travel and waiting times, as well as improved access to specialized care.\\n- Local healthcare providers are equipped to deliver focused cancer treatment, leading to better patient outcomes."
  }',
  'Health',
  'General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Strengthening Urban Livelihoods',
  'A comprehensive initiative aimed at enhancing the economic and social well-being of urban populations through skill development, entrepreneurship support, and improved urban infrastructure.',
  '{
    "explanation": "- This feature encompasses a range of programs designed to uplift urban communities by providing vocational training, financial support, and better access to urban amenities.\\n- Official government resources highlight efforts to improve urban employment and boost small businesses, thereby strengthening the overall urban economy.",
    "affects": "- Urban workers, especially those in low-income groups, benefit from improved job opportunities and skill development initiatives.\\n- Entrepreneurs receive support to launch and sustain small businesses, contributing to urban economic growth."
  }',
  'Development',
  'General Public',
  '18-60',
  'Urban Areas'
);

CALL AddFeatureWithTags(
  'PM SVANidhi',
  'A scheme aimed at providing affordable working capital loans to street vendors to help sustain and expand their businesses, thereby supporting the informal sector.',
  '{
    "explanation": "- PM SVANidhi is a government scheme that gives small, affordable loans to street vendors, helping them get the money they need quickly for daily operations or to improve their business.\\n- These loans help vendors buy supplies, upgrade their setups, or cover everyday expenses without facing heavy financial burdens.\\n- The scheme is part of a broader effort to include all sections of society in the formal financial system, ensuring even small vendors have access to easy credit.\\n- By reducing financial stress, it encourages vendors to invest in and expand their businesses.",
    "affects": "- Street vendors can access funds more easily, which helps them keep their businesses running smoothly.\\n- The financial support helps improve the quality of services and products offered by vendors.\\n- It strengthens the overall informal sector by reducing the financial challenges faced by small business owners.\\n- Over time, the initiative contributes to urban economic stability by empowering low-income entrepreneurs."
  }',
  'Finance',
  'Low-Income Individuals',
  '18-60',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'Social Security Scheme for Welfare of Online Platform Workers',
  'A scheme designed to extend social security benefits—including health insurance, accident coverage, and pension schemes—to workers in the online platform and gig economy.',
  '{
    "explanation": "- This scheme aims to provide a safety net for online platform workers who typically do not receive traditional employment benefits.\\n- According to official government resources, the scheme includes provisions for insurance, retirement benefits, and accident coverage to ensure social and financial protection for these workers.",
    "affects": "- Workers engaged in the gig economy, such as delivery personnel, ride-sharing drivers, and freelancers, benefit from enhanced social security coverage.\\n- This initiative helps safeguard vulnerable workers by offering a structured support system, contributing to greater economic stability in the sector."
  }',
  'Social Security',
  'General Public',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Public Private Partnership in Infrastructure',
  'A government initiative to leverage public-private partnerships (PPP) for developing and maintaining key infrastructure projects.',
  '{
    "explanation": "- Promotes collaboration between the government and private sector for infrastructure development.\\n- Focuses on risk-sharing, efficiency, and timely project completion.\\n- Covers sectors like roads, railways, airports, and urban transit as per official policies.\\n- Adheres to established guidelines for transparency and accountability.",
    "affects": "- Accelerates infrastructure development and modernization.\\n- Offers investment opportunities for private firms.\\n- Optimizes the use of public funds and resources.\\n- Enhances public access to quality infrastructure."
  }',
  'Economy, Infrastructure',
  'General Public, Investors',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Support to States for Infrastructure',
  'A dedicated scheme providing financial and technical support to state governments for upgrading and developing critical infrastructure.',
  '{
    "explanation": "- Allocates targeted funds to state governments for key infrastructure projects.\\n- Provides technical assistance and capacity building in line with official guidelines.\\n- Focuses on transportation, urban development, and rural connectivity.\\n- Aims to reduce regional disparities through empowered state-level execution.",
    "affects": "- Enhances state capacity to implement large-scale projects.\\n- Improves local public services and connectivity.\\n- Stimulates regional economic growth.\\n- Attracts further private and institutional investments."
  }',
  'Economy, Infrastructure',
  'General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Asset Monetization Plan 2025-30',
  'A strategic initiative to unlock the value of public assets by monetizing them, thereby generating additional revenue for the government.',
  '{
    "explanation": "- This plan looks at government-owned properties such as land, buildings, and infrastructure that are not being used to their full potential.\\n- It involves selling, leasing, or otherwise using these assets to make money, offering an alternative source of income besides taxes.\\n- The extra revenue generated can be used to fund important public projects and services.\\n- The process is carried out using clear, transparent rules set by the Ministry of Finance to ensure fairness.",
    "affects": "- Provides the government with new funds that can be reinvested in critical infrastructure and social projects.\\n- Opens up opportunities for private investors to participate in or benefit from these assets.\\n- Improves overall financial management by diversifying the sources of government revenue.\\n- Helps support long-term economic growth by funding future public investments."
  }',
  'Economy, Finance',
  'Investors, General Public',
  '18-60',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'Jal Jeevan Mission',
  'A flagship initiative aimed at providing safe and adequate drinking water to every rural household through individual household tap connections.',
  '{
    "explanation": "- Ensures the creation of sustainable water infrastructure in rural areas.\\n- Guarantees potable water supply to every household as per Ministry of Jal Shakti guidelines.\\n- Utilizes technology for water quality monitoring and efficient management.\\n- Integrates with broader rural development and health improvement strategies.",
    "affects": "- Improves health and hygiene in rural communities.\\n- Reduces waterborne diseases through reliable water access.\\n- Enhances the quality of life in rural areas.\\n- Strengthens overall rural infrastructure and development."
  }',
  'Health',
  'General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Urban Challenge Fund',
  'A competitive grant scheme designed to encourage innovative solutions for addressing urban challenges in Indian cities.',
  '{
    "explanation": "- Provides financial support for innovative projects addressing urban issues like waste management and mobility.\\n- Encourages sustainable and inclusive solutions as outlined in official urban development policies.\\n- Utilizes a competitive selection process to fund projects with measurable impact.\\n- Focuses on modernizing urban infrastructure and services.",
    "affects": "- Enhances urban public services and infrastructure.\\n- Empowers local governments to implement creative solutions.\\n- Improves the quality of urban life for residents.\\n- Drives sustainable economic growth in urban areas."
  }',
  'Economy',
  'Innovators',
  'All Ages',
  'Urban Areas'
);

CALL AddFeatureWithTags(
  'Nuclear Energy Mission for Viksit Bharat',
  'A mission aimed at expanding India’s nuclear power capacity and enhancing energy security as part of the broader strategy for a developed Bharat.',
  '{
    "explanation": "- Expands nuclear power capacity to diversify India’s energy mix.\\n- Focuses on advanced reactor technology and stringent safety measures.\\n- Aligns with official plans to reduce carbon emissions and dependence on fossil fuels.\\n- Seeks to enhance energy security and support sustainable development.",
    "affects": "- Provides a stable and diversified energy supply for industrial and residential use.\\n- Benefits the energy sector with opportunities for innovation and job creation.\\n- Contributes to long-term economic stability by reducing import dependency.\\n- Enhances national security through a robust energy infrastructure."
  }',
  'Economy, Energy',
  'General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Shipbuilding',
  'An initiative to bolster domestic shipbuilding capabilities under the “Make in India” framework, focusing on both defense and commercial sectors.',
  '{
    "explanation": "- Increases domestic production capacity for both commercial and defense vessels.\\n- Promotes technology transfer and modernization of shipbuilding practices.\\n- Encourages public-private partnerships for efficient project execution.\\n- Aims to reduce import dependency and boost export potential.",
    "affects": "- Strengthens national security through enhanced indigenous warship production.\\n- Creates employment opportunities and skill development in maritime engineering.\\n- Boosts local industries and coastal economic growth.\\n- Improves India’s competitiveness in global maritime trade."
  }',
  'Economy, Maritime',
  'General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Maritime Development Fund',
  'A dedicated fund established to finance maritime infrastructure and port modernization projects, supporting the growth of India’s maritime trade.',
  '{
    "explanation": "- Provides financial support for port upgrades and maritime infrastructure projects.\\n- Encourages public-private partnerships to enhance operational efficiency.\\n- Focuses on modernizing logistics and connectivity for maritime trade.\\n- Follows guidelines issued by relevant government authorities.",
    "affects": "- Improves efficiency and competitiveness of India’s ports and logistics.\\n- Benefits shipping companies and local businesses with enhanced infrastructure.\\n- Stimulates regional economic development in coastal areas.\\n- Creates job opportunities in the maritime and logistics sectors."
  }',
  'Economy, Infrastructure',
  'Investors',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'UDAN - Regional Connectivity Scheme',
  'A flagship initiative aimed at enhancing regional air connectivity by subsidizing flights to underserved regions, thereby boosting regional development.',
  '{
    "explanation": "- Subsidizes flights to improve connectivity for smaller cities and rural regions.\\n- Enhances operational efficiency and expands air route networks.\\n- Aims to make air travel affordable for the common citizen.\\n- Part of the government’s broader strategy to stimulate regional economic growth.",
    "affects": "- Reduces travel costs and increases mobility for regional populations.\\n- Stimulates local business, tourism, and overall economic activity.\\n- Provides growth opportunities for regional airports and ancillary services.\\n- Enhances national integration by connecting remote areas with major hubs."
  }',
  'Economy, Aviation',
  'General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Greenfield Airport in Bihar',
  'A project to establish a modern greenfield airport in Bihar, aimed at improving regional air connectivity and supporting local economic development.',
  '{
    "explanation": "- Develops a state-of-the-art airport with modern infrastructure and sustainable design.\\n- Aims to boost regional connectivity by providing direct air links.\\n- Attracts investment by improving transportation infrastructure in Bihar.\\n- Follows guidelines and best practices from official aviation policies.",
    "affects": "- Enhances travel options and reduces transit times for Bihar residents.\\n- Drives regional economic growth through improved logistics and tourism.\\n- Creates job opportunities in construction, aviation, and related sectors.\\n- Supports long-term business and trade expansion in the region."
  }',
  'Economy, Aviation, Infrastructure',
  'General Public',
  'All Ages',
  'Bihar'
);

CALL AddFeatureWithTags(
  'Western Koshi Canal Project in Mithilanchal',
  'A major water resources development project aimed at enhancing irrigation, flood control, and water supply in the Mithilanchal region.',
  '{
    "explanation": "- Optimizes water management by channeling Western Koshi flows.\\n- Enhances irrigation potential to improve agricultural productivity.\\n- Incorporates flood mitigation measures to protect vulnerable communities.\\n- Aligns with national water resource development policies.",
    "affects": "- Benefits local farmers through improved irrigation infrastructure.\\n- Reduces flood risks and associated damages.\\n- Boosts agricultural productivity and food security.\\n- Supports sustainable water management in the region."
  }',
  'Economy, Agriculture, Infrastructure',
  'Farmers',
  '18-60',
  'Mithilanchal'
);

CALL AddFeatureWithTags(
  'Mining Sector Reforms',
  'A series of policy measures aimed at modernizing the mining sector to promote sustainable development, transparency, and increased revenue.',
  '{
    "explanation": "- Streamlines regulatory procedures to ensure transparency in mining operations.\\n- Encourages sustainable and responsible mining practices.\\n- Promotes modernization and technological upgrades in the sector.\\n- Aims to enhance revenue generation while safeguarding environmental interests.",
    "affects": "- Provides a clearer framework for investors and mining companies.\\n- Improves employment prospects in the mining and ancillary sectors.\\n- Ensures environmental protection alongside economic growth.\\n- Contributes to sustainable resource management."
  }',
  'Economy, Mining',
  'Investors, Mining Companies, Job Seekers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'SWAMIH Fund 2',
  'A government fund designed to support the modernization and expansion of small and micro enterprises through targeted financial assistance and capacity building.',
  '{
    "explanation": "- Represents the second phase of the SWAMIH initiative for small enterprises.\\n- Provides financial support for technology adoption and modernization.\\n- Focuses on capacity building and market access improvement.\\n- Implements transparent fund allocation processes as per official guidelines.",
    "affects": "- Enhances access to finance for small and micro enterprises.\\n- Drives technological and operational upgrades.\\n- Creates employment opportunities and fosters economic growth.\\n- Strengthens the competitiveness of domestic enterprises."
  }',
  'Economy, SMEs',
  'Small Business Owners, Job Seekers, Entrepreneurs, Investors',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Tourism for Employment-Led Growth',
  'A government initiative aimed at developing tourism infrastructure and services to generate employment and spur local economic growth.',
  '{
    "explanation": "- Focuses on enhancing tourism infrastructure and promoting local tourism initiatives.\\n- Emphasizes skill development and capacity building in the tourism sector.\\n- Promotes sustainable tourism practices in line with official policies.\\n- Integrates tourism development with local economic growth strategies.",
    "affects": "- Generates direct and indirect employment in tourism and hospitality.\\n- Increases local economic activity through higher tourist inflows.\\n- Provides training and skill development for the local workforce.\\n- Enhances the cultural and tourism profile of the region."
  }',
  'Economy, Tourism',
  'Tourism Entrepreneurs, Job Seekers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Research, Development and Innovation',
  'A comprehensive initiative aimed at strengthening the nation’s R&D and innovation ecosystem across sectors to drive technological and economic progress.',
  '{
    "explanation": "- Encourages collaboration between academia, industry, and research institutions.\\n- Provides funding and policy support for breakthrough research projects.\\n- Enhances state-of-the-art research facilities and innovation hubs.\\n- Aligns with national priorities for technology-led growth.",
    "affects": "- Empowers researchers and innovators with advanced resources.\\n- Accelerates commercialization of new technologies.\\n- Boosts economic growth by fostering innovation-driven industries.\\n- Enhances India’s competitiveness in global research."
  }',
  'Innovation, Research',
  'Researchers, Innovators, Entrepreneurs',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Deep Tech Fund of Funds',
  'A dedicated financial initiative designed to channel investments into deep technology startups that work on cutting-edge innovations in areas such as AI, quantum computing, and biotechnology.',
  '{
    "explanation": "- Provides capital support to emerging deep tech ventures.\\n- Encourages investments in breakthrough technological areas through a fund-of-funds model.\\n- Facilitates technology transfer and commercialization processes.\\n- Follows official guidelines to ensure transparent fund allocation.",
    "affects": "- Helps startups scale up and refine their innovations.\\n- Attracts private sector participation in high-tech research.\\n- Supports job creation in advanced technology sectors.\\n- Enhances India’s reputation as a hub for deep technology innovation."
  }',
  'Innovation, Finance',
  'Investors, Technologists',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'PM Research Fellowship',
  'A fellowship program aimed at nurturing early-career researchers by providing financial assistance, mentorship, and the opportunity to work on high-impact research projects aligned with national priorities.',
  '{
    "explanation": "- Offers financial grants and research support to promising young scientists.\\n- Provides mentorship from leading experts across various fields.\\n- Encourages innovative research projects that address national challenges.\\n- Aligns with the government’s agenda for research-led development.",
    "affects": "- Enables emerging researchers to pursue ambitious projects.\\n- Strengthens academic-industry collaborations.\\n- Contributes to technological advancements and knowledge creation.\\n- Enhances India’s global research standing."
  }',
  'Innovation, Education, Research',
  'Researchers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Gene Bank for Crops Germplasm',
  'An initiative focused on preserving the genetic diversity of crops by cataloging and safeguarding germplasm, which is crucial for agricultural innovation and food security.',
  '{
    "explanation": "- Works like a library for crop seeds and genetic material, safely storing a wide range of varieties for future use.\\n- Helps support plant breeding and research programs that aim to develop stronger, more resilient crops.\\n- Ensures that valuable genetic traits are preserved for improving crops over time.\\n- Enhances the ability of the agricultural sector to cope with challenges like climate change.",
    "affects": "- Provides farmers with access to diverse crop varieties that can lead to better yields and disease resistance.\\n- Enables researchers to develop improved crops that can thrive in different environmental conditions.\\n- Supports food security by ensuring a continuous supply of essential crop varieties.\\n- Promotes sustainable agriculture through the preservation of important genetic resources."
  }',
  'Innovation, Agriculture',
  'Farmers, Researchers',
  '18-60',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'National Geospatial Mission',
  'A government initiative to create a comprehensive geospatial data infrastructure, supporting enhanced planning, governance, and innovation across various sectors.',
  '{
    "explanation": "- Creates detailed digital maps using satellite images and on-ground data, making it easier for officials to understand and manage land and resources.\\n- Helps urban planners design better cities by providing accurate maps of roads, buildings, and natural features.\\n- Supports disaster management by offering real-time information for quick decision-making during emergencies.\\n- Follows strict guidelines from the Ministry of Earth Sciences to ensure the data is reliable and accurate.",
    "affects": "- Gives policymakers and planners the tools to make informed decisions about city planning and resource allocation.\\n- Improves public safety by enabling faster and more coordinated responses during disasters.\\n- Boosts innovation in technology, as accurate maps are essential for apps and services like navigation and location-based services.\\n- Enhances overall governance by using reliable, data-driven insights for planning and development."
  }',
  'Innovation, Technology',
  'Researchers, Technologists',
  'All Ages',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'Gyan Bharatam Mission',
  'A mission aimed at promoting knowledge dissemination and digital literacy by fostering innovative learning solutions, ultimately contributing to a knowledge-based economy.',
  '{
    "explanation": "- Promotes digital literacy and widespread access to educational resources.\\n- Encourages development and adoption of innovative learning platforms.\\n- Enhances skill development and research through technology integration.\\n- Supported by initiatives under the Ministry of Education and Digital India.",
    "affects": "- Empowers students and educators with modern digital tools.\\n- Improves learning outcomes and academic performance.\\n- Facilitates continuous skill enhancement and lifelong learning.\\n- Contributes to building a competitive, knowledge-driven economy."
  }',
  'Innovation, Education',
  'Students, Teachers',
  '0-18, 18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Export Promotion Mission',
  'A strategic initiative to boost India’s export performance through policy support, market access facilitation, and targeted incentives for export-oriented industries.',
  '{
    "explanation": "- Provides targeted incentives and financial support to exporters.\\n- Focuses on diversifying export products and markets.\\n- Encourages public-private partnerships for enhanced export promotion.\\n- Aligns with government policies to strengthen India’s global trade presence.",
    "affects": "- Increases export revenues and overall economic growth.\\n- Enhances market access for SMEs and large exporters alike.\\n- Creates job opportunities in export-oriented sectors.\\n- Strengthens India’s trade balance by expanding global market outreach."
  }',
  'Exports, Economy',
  'Exporters',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'BharatTradeNet',
  'A digital trade platform initiative aimed at streamlining export procedures, providing real-time trade information, and facilitating seamless interactions between exporters and global buyers.',
  '{
    "explanation": "- Serves as a one-stop online platform for export documentation and trade information.\\n- Integrates compliance processes and regulatory guidelines into a single interface.\\n- Enhances transparency and efficiency in export transactions.\\n- Supports exporters by simplifying access to market intelligence and trade resources.",
    "affects": "- Reduces administrative burdens and streamlines export procedures.\\n- Improves communication between exporters and international buyers.\\n- Increases competitiveness through timely access to trade data.\\n- Facilitates a more efficient and transparent export ecosystem."
  }',
  'Exports, Digital',
  'Exporters',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'National Framework for GCC',
  'A structured initiative to align India’s export standards with global best practices, ensuring quality, compliance, and competitiveness in international markets.',
  '{
    "explanation": "- This initiative sets up common quality and certification rules for products that India exports, so they meet the same standards recognized worldwide.\\n- It aligns India’s export quality measures with those used internationally, making products easier to sell in global markets.\\n- Provides training and technical support to exporters, helping them understand and meet these global standards.\\n- Encourages all exporters to follow these guidelines to ensure safety and quality, just like products from other countries.",
    "affects": "- Increases trust in Indian products because they meet internationally recognized quality standards.\\n- Opens up new markets for exporters, as buyers around the world feel more confident purchasing certified products.\\n- Helps boost the reputation of Indian exports, making them more competitive globally.\\n- Contributes to sustainable long-term growth in India’s export sector."
  }',
  'Exports',
  'Exporters',
  '18-60',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'FDI in Insurance Sector',
  'A reform that allows more foreign direct investment in insurance companies, aiming to improve capital access, bring in global expertise, and enhance competition.',
  '{
    "explanation": "- Increases the allowed level of foreign investment in insurance firms.\\n- Brings global expertise and advanced technology.\\n- Aims to boost competition and efficiency in the insurance market.\\n- Follows guidelines set by finance and insurance regulators.",
    "affects": "- Insurance companies receive better access to capital.\\n- Consumers benefit from improved and innovative insurance products.\\n- Enhances the overall stability and growth of the insurance sector.\\n- Supports a more robust financial environment."
  }',
  'Financial Reforms, Insurance',
  'Investors, General Public',
  'All Ages',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Credit Enhancement Facility by NaBFID',
  'A support initiative by NaBFID designed to offer extra guarantees to banks, making it safer for them to lend money.',
  '{
    "explanation": "- Acts as a safety net for banks by providing extra guarantees if borrowers fail to repay loans.\\n- Reduces the risk of banks incurring significant losses, encouraging them to lend more freely.\\n- Ensures banks have sufficient funds (liquidity) to operate, following NaBFID guidelines.\\n- Helps maintain a stable financial environment by minimizing losses from unpaid loans.",
    "affects": "- Banks can lend more confidently, increasing access to credit for individuals and businesses.\\n- Borrowers may benefit from easier access to loans and potentially lower interest rates.\\n- Contributes to overall financial stability by reducing risks in the banking sector.\\n- Makes the lending process safer and more efficient for everyone involved."
  }',
  'Financial Reforms, Credit',
  'Banks, Borrowers, Policy Makers',
  '18-60',
  'Nationwide'
);


CALL AddFeatureWithTags(
  'Grameen Credit Score',
  'A credit scoring system specially designed to assess the creditworthiness of rural and low-income individuals using alternative data sources.',
  '{
    "explanation": "- Uses non-traditional data to generate a credit score for rural borrowers.\\n- Aims to improve access to credit for low-income populations.\\n- Follows official methods to fairly assess creditworthiness.\\n- Supports government efforts to boost financial inclusion.",
    "affects": "- Helps rural and low-income individuals secure loans.\\n- Promotes fairer and more transparent loan assessments.\\n- Enhances financial inclusion in underserved areas.\\n- Builds trust between banks and borrowers."
  }',
  'Financial Reforms, Credit',
  'Rural Population, Low-Income Individuals, Policy Makers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Pension Sector',
  'A series of reforms aimed at improving the pension system to provide secure, transparent, and adequate retirement benefits for citizens.',
  '{
    "explanation": "- Focuses on better management and expansion of pension schemes.\\n- Seeks to ensure secure and sufficient retirement income for workers.\\n- Enhances transparency in pension fund operations.\\n- Adheres to guidelines from pension regulatory authorities.",
    "affects": "- Provides a more secure retirement income for the working population.\\n- Improves transparency in the management of pension funds.\\n- Offers better benefits to pensioners.\\n- Contributes to overall financial stability for retirees."
  }',
  'Financial Reforms, Pension',
  'Working Population, Retirees, Policy Makers',
  '18-60, 60+',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'High Level Committee for Regulatory Reforms',
  'A government committee set up to review and recommend improvements in regulatory policies to create a simpler and more business-friendly environment.',
  '{
    "explanation": "- Reviews current regulatory rules and identifies areas for simplification.\\n- Aims to reduce bureaucratic hurdles for businesses.\\n- Provides clear, actionable recommendations for regulatory improvements.\\n- Operates under official mandates to enhance transparency.",
    "affects": "- Simplifies compliance for businesses and investors.\\n- Boosts confidence in the regulatory environment.\\n- Leads to more efficient business operations.\\n- Supports overall economic growth by reducing administrative burdens."
  }',
  'Financial Reforms, Regulatory',
  'Investors, Businesses, Policy Makers',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Investment Friendliness Index of States',
  'An index that ranks states based on their ease of doing business, infrastructure quality, and regulatory environment, helping to guide investment decisions.',
  '{
    "explanation": "- Measures and compares states on ease of doing business and regulatory factors.\\n- Evaluates infrastructure, governance, and policy support.\\n- Provides a clear ranking to highlight investment-friendly states.\\n- Developed by official government agencies.",
    "affects": "- Guides investors toward states with better business conditions.\\n- Encourages states to improve their investment climates.\\n- Helps policymakers target necessary reforms.\\n- Boosts healthy competition among states."
  }',
  'Financial Reforms, Investment',
  'Investors',
  '18-60',
  'Nationwide'
);

CALL AddFeatureWithTags(
  'Jan Vishwas Bill 2.0',
  'A new law aimed at making it easier for people and businesses to follow government rules on taxes and other regulations, reducing the burden of paperwork and cost.',
  '{
    "explanation": "- This law makes it simpler for everyone to follow government rules (called compliance) when paying taxes and meeting other legal requirements.\\n- It cuts down on the paperwork and costs that people and businesses usually face.\\n- The law is designed to build trust by making the whole process clear and straightforward.\\n- It is based on updated official guidelines to ensure that following government rules is less confusing and less expensive.",
    "affects": "- Reduces the hassle and cost for businesses and individuals in dealing with government rules.\\n- Makes it easier for everyone to understand and meet their tax and legal obligations.\\n- Builds greater trust in how government rules are enforced.\\n- Creates a more user-friendly environment for all citizens."
  }',
  'Financial Reforms',
  'General Public, Businesses',
  '18–60',
  'Nationwide'
);



FLUSH PRIVILEGES;
