require 'sinatra'
require 'sinatra/partial'
require 'sinatra/reloader' if development?

require 'hpricot'
require 'open-uri'

get '/' do
  erb :main
end

get '/get/video/url' do
    url = params[:url]

    doc = open(url) { |f| Hpricot(f) }

    vine_url = doc.at("//source").attributes["src"]
    if vine_url
        { :result => "success", :url => vine_url }.to_json
    else
        { :result => "fail" }.to_json
    end
end