#!/usr/bin/ruby
#
# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#     Unless required by applicable law or agreed to in writing, software
#     distributed under the License is distributed on an "AS IS" BASIS,
#     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#     See the License for the specific language governing permissions and
#     limitations under the License.

require 'pp'
require 'marky_markov'
require 'google-search'
require 'faker'

# Template is from: http://www.freewebtemplates.com/download/free-website-template/pied-463775934/demo/
IN_INDEX = "templates/index.html"
IN_STYLE = "tempaltes/style.css"

def get_text(filename, paragraphs = nil)
  markov = MarkyMarkov::TemporaryDictionary.new()
  markov.parse_file(filename)

  if(paragraphs.nil?)
    paragraphs = rand(3..10)
  end

  text = []
  1.upto(paragraphs) do
    words = rand(30..100)
    text << markov.generate_n_words(words)
  end

  markov.clear! # Clear the temporary dictionary.

  text.map! do |line|
    line = line.downcase.gsub(/([a-z])([^.?!]*)/) { $1.upcase + $2.rstrip }
    line[0] = line[0].upcase
    line += "."
    line = "<p>" + line + "</p>"
    line
  end

  return text
end

def fill_template(files, replacements)
  result = {}

  files.each do |file|
    File.open(file, "r") do |f|
      data = f.read()

      replacements.each_pair do |from, to|
        data = data.gsub('%%' + from + '%%', to)
      end
      result[file] = data
    end
  end

  return result
end

COMPANY_NAME    = Faker::Company.name + " " + Faker::Company.suffix
COPMPANY_SLOGAN = Faker::Company.catch_phrase #=> "Business-focused coherent parallelism"
COMPANY_BS      = Faker::Company.bs #=> "empower one-to-one web-readiness"
COMPANY_CEO     = Faker::Name.name

# From http://hbswk.hbs.edu/industries/
COMPANY_TYPES = [
  "Accounting", "Advertising", "Aerospace", "Agriculture", "Aircraft",
  "Airline", "Apparel & Accessories", "Automotive", "Banking", "Biotechnology",
  "Broadcasting", "Brokerage", "Call Centers", "Cargo Handling", "Chemical",
  "Computer", "Consulting", "Consumer Products", "Cosmetics", "Defense",
  "Department Stores", "Education", "Electronics", "Energy", "Entertainment & Leisure",
  "Executive Search", "Financial Services", "Food, Beverage & Tobacco", "Grocery", "Health Care",
  "Internet Publishing", "Investment Banking", "Legal", "Manufacturing", "Motion Picture & Video",
  "Music", "Newspaper Publishers", "Online Auctions", "Pension Funds", "Pharmaceuticals",
  "Private Equity", "Publishing", "Real Estate", "Retail & Wholesale", "Securities & Commodity Exchanges",
  "Service", "Soap & Detergent", "Software", "Sports", "Technology",
  "Telecommunications", "Television", "Transportation", "Trucking", "Venture Capital",
]

PAGE_TYPES = [ "Products", "Services", "Research", "Events", "Donate", "Shop", "Blog", "Support", "Documentation" ]

# Inspired by http://www.onextrapixel.com/2013/10/25/40-stunning-website-designs-with-great-color-schemes/
# and http://blog.crazyegg.com/2012/07/11/website-color-palettes/
COLOUR_SCHEMES = [
  ["#005a31", "#a8cd1b", "#cbe32d", "#f3fab6",], ["#191919", "#df3d82", "#ffffff", "#000000",],
  ["#191919", "#dfe2db", "#fff056", "#ffffff",], ["#202020", "#b81d18", "#b6b6b6", "#004687",],
  ["#29e36a", "#3b5998", "#639bf1", "#77ba9b",], ["#2b2b2b", "#de1b1b", "#f6f6f6", "#e9e581",],
  ["#333333", "#e05151", "#d9411e", "#ffd452",], ["#393939", "#ff5a09", "#f3843e", "#ff9900",],
  ["#3d3c3a", "#707070", "#ddd4bc", "#f8dc0b",], ["#3f2860", "#90c5a9", "#7a9a95", "#ef6d3b",],
  ["#404040", "#6dbdd6", "#b71427", "#ffe658",], ["#558c89", "#74afad", "#d9853b", "#ececea",],
  ["#57102c", "#4ca8a1", "#7ec2aa", "#bcc747",], ["#585858", "#118c4e", "#c1e1a6", "#ff9009",],
  ["#766151", "#48372f", "#514947", "#fee202",], ["#796e24", "#f9df8d", "#ee9c21", "#ea7d24",],
  ["#7d1935", "#4a96ad", "#f5f3ee", "#ffffff",], ["#9bce7d", "#72ac93", "#699e87", "#bd0102",],
  ["#c63d0f", "#3b3738", "#fdf3e7", "#7e8f7c",], ["#e44424", "#67bcdb", "#a2ab58", "#ffffff",],
  ["#b08b0d", "#97282c", "#428f89", "#5f6024",], ["#b5b5b5", "#92dce0", "#0092d7", "#3ec303",],
  ["#bccf02", "#5bb12f", "#9b539c", "#eb65a0",], ["#c7d0d5", "#93b1c6", "#f5f5f5", "#ff7148",],
  ["#cdcab9", "#d6d3c4", "#dfded4", "#432f21",], ["#e2da99", "#342800", "#5e9ca0", "#73afb6",],
  ["#ebe3e0", "#edd5d1", "#e3d6c6", "#dde0cd",], ["#ebff33", "#a0fb71", "#58f8ab", "#12f6e9",],
  ["#f2f2f3", "#1fda9a", "#ee4b3e", "#e9bc1b",], ["#fff2e7", "#d0cabf", "#b9b1a8", "#de8642",],
  ["#ffffff", "#fcdf15", "#d40e52", "#0b99bc",]
]
COLOURS = COLOUR_SCHEMES.sample(1).pop
puts("Picked a colour scheme: #{COLOURS}")
PAGES = PAGE_TYPES.sample(5)

COMPANY_TYPE = COMPANY_TYPES.sample(1).pop
puts("Creating a company of type #{COMPANY_TYPE}")

# Not including logos because copyright issues
#puts("Getting a logo...")
#LOGO = Google::Search::Image.new(:query => COMPANY_TYPE + " logo").to_a.sample(1).pop.uri
#puts("Found one: " + LOGO)

ABOUT_TEXT = get_text("data/about.txt").join("\n\n").gsub(/COMPANY/, COMPANY_NAME).gsub(/PERSON/, COMPANY_CEO)

test = fill_template([IN_INDEX, IN_STYLE], {
  "COMPANY" => COMPANY_NAME,
  "PAGE2"   => PAGES[0],
  "PAGE3"   => PAGES[1],
  "PAGE4"   => PAGES[2],
  "PAGE5"   => PAGES[3],
  "CONTENT" => ABOUT_TEXT,
  "COLOR1"  => COLOURS[0],
  "COLOR2"  => COLOURS[1],
  "COLOR3"  => COLOURS[2],
  "COLOR4"  => COLOURS[3],
})

File.open("out/index.html", "w") do |f|
  f.write(test["site/index.html"])
end

File.open("out/styles.css", "w") do |f|
  f.write(test["site/styles.css"])
end
